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

export async function flowSendRecipe(massa: any): Promise<void> {

    const token = await createToken();
    const objectId = await sendRecipe(token, massa.fullName, massa.cardNumber, massa.CT, massa.cpf, massa.clientGroup);
    await uploadImage(token, objectId);
}