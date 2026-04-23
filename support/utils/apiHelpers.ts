import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://hachimon-staging.vidalink.com.br';

const data = new Date();
data.setDate(data.getDate() - 1);
const yesterday = `${data.toISOString().split('T')[0]}T00:00:00`;

export async function createToken(): Promise<string> {
    const url = `${baseUrl}/token`;

    const payloadApp = {
        service_hash: '0a32427a-aaa6-4c3f-a22f-e1f9e5ad8916'
    };

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await axios.post(url, payloadApp, params);

    if (response.status !== 200) {
        throw new Error(`Falha ao gerar token: Status ${response.status}`);
    }

    return response.data.access_token;
}

export async function sendRecipe(token: string, fullName: string, cardNumber: string, CT: string, cpf: string, clientGroup: string): Promise<string> {
    const url = `${baseUrl}/v1.0/prescription/Previous-Shipment/`;

    const payload = {
        "prescriptionName": `Receita ${fullName}`,
        "cardNumber": `${cardNumber}`,
        "customerId": `${CT}`,
        "clientGroup": `${clientGroup}`,
        "products": [
            "Dipirona",
            "Advil"
        ],
        "ddd": "00",
        "phoneNumber": "00000-0000",
        "userName": `${fullName}`,
        "socialId": `${cpf}`,
        "prescriptionDate": yesterday,
        "regionalCouncil": 123456,
        "regionalCouncilType": 1,
        "stateRegionalCouncil": "SP"
    };

    const params = {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const response = await axios.post(url, payload, params);

    if (response.status !== 201) {
        throw new Error(`Falha no envio: Status ${response.status}`);
    }

    return response.data.data.objectId;
}

export async function uploadImage(token: string, objectId: string) {
    const url = `${baseUrl}/v1.0/Prescription/Previous-Shipment/${objectId}/add-file`;

    const form = new FormData();

    const imagePath = path.resolve(process.cwd(), 'support/image/recipe.jpg');
    const imageStream = fs.createReadStream(imagePath);
    form.append('file', imageStream, {
        filename: 'recipe.jpg',
        contentType: 'image/jpeg'
    });
    form.append('descricao', 'exemplo receita');

    const res = await axios.patch(url, form, {
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`,
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
            'Accept': 'application/json',
        },
    });

    if (res.status !== 202) {
        throw new Error(`Erro ao anexar imagem: Status ${res.status}`);
    }

    return res.data;
}

export async function addStatusAnalysis(token: string, objectId: string): Promise<string> {
    const url = `${baseUrl}/v1.0/Prescription/Previous-Shipment/iteration/analysestatushistory`;

    const payload = {
        username: "teste",
        status: 1,
        objectId: objectId
    };

    const response = await axios.patch(url, payload, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new Error(`Falha ao adicionar status de análise: Status ${response.status}`);
    }

    return response.data.processedAt;
}

export async function genericSearch(token: string, massa: any): Promise<string> {
    const search = massa.products ? massa.products[0] : "DIPIRONA";

    const url = `${baseUrl}/v1.0/product`;

    const response = await axios.get(url, {
        params: {
            customerId: massa.CT,
            cardNumber: massa.cardNumber,
            search: search,
            latitude: -23.615799,
            longitude: -46.570010,
            from: 1,
            limit: 10
        },
        headers: {
            'Authorization': `Bearer ${token}`,
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
            'Accept': 'application/json',
        },
    });

    if (response.status !== 200) {
        throw new Error(`Falha na pesquisa genérica: Status ${response.status}`);
    }

    const ean = response.data.data[0].identification.code;

    return ean;
}

export async function updateIteration(
    token: string,
    objectId: string,
    processedAt: string,
    ean: string,
    massa: any
): Promise<void> {
    const url = `${baseUrl}/v1.0/Prescription/Previous-Shipment/iteration`;

    // Fazemos o mapeamento dos campos do seu JSON para o que a API pede
    const payload = {
        objectId: objectId,
        status: {
            status: "Approved",
            reprovalInformation: {
                IdReprovalReasons: null
            }
        },
        prescriptionDate: yesterday,
        regionalCouncil: 123456,
        stateRegionalCouncil: "SP",
        products: [
            {
                name: "DIPIRONA SODICA",
                ean: ean,
                dosage: 1,
                DaysValid: 10,
                productStatus: {
                    idStatus: 1,
                    status: "Approved"
                },
                attributes: [1]
            }
        ],
        userName: massa.fullName,
        socialId: massa.cpf,
        cardNumber: massa.cardNumber,
        startAnalyseDateTime: processedAt,
        clientId: massa.CT
    };

    const response = await axios.patch(url, payload, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    });

    if (response.status !== 202) {
        throw new Error(`Falha na atualização da iteração: Status ${response.status}`);
    }
}

export async function flowSendRecipe(massa: any): Promise<void> {

    const token = await createToken();
    const ean = await genericSearch(token, massa);
    const objectId = await sendRecipe(
        token,
        massa.fullName,
        massa.cardNumber,
        massa.CT,
        massa.cpf,
        massa.clientGroup
    );
    await uploadImage(token, objectId);
    const processedAt = await addStatusAnalysis(token, objectId);
    await updateIteration(
        token,
        objectId,
        processedAt,
        ean,
        massa
    );

    console.log(`Receita ${objectId} gerada e aprovada para ${massa.fullName}`);
}