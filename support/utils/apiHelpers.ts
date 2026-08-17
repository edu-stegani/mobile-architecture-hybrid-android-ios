import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const baseUrl = 'https://servidor-hml-exemplo.com.br';

export async function createToken(): Promise<string> {
    const url = `${baseUrl}/token`;

    const payloadApp = {
        service_hash: 'xxxxxxxxxxxxxxxxxxxxxxxxxx'
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
    const url = `${baseUrl}/rota-endpoint`;

    const today = new Date();
    const prescriptionDate = `${today.toISOString().split('T')[0]}T00:00:00`;

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
        "prescriptionDate": prescriptionDate,
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
    const url = `${baseUrl}/rota-endpoint`;
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
            'Vidalink-Session-Id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
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

export async function createRequestRefund(token: string, customerId: string, cardNumber: string): Promise<{ id: number, protocol: string }> {
    const url = `${baseUrl}/rota-endpoint`;    

    const payload = {
        "motiveId": 45,
        "products": [
            "Teste Automatizado"
        ]
    }
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Vidalink-Session-Id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(url, payload, params);
    if (response.status !== 200) {
        throw new Error(`Falha ao criar a solicitação de reembolso: Status ${response.status}`);
    }
    return response.data.data;
}

export async function uploadRefundFile(token: string, refundId: number, fileType: 'invoice' | 'prescription'): Promise<number> {
    const url = `${baseUrl}/rota-endpoint`;
    const form = new FormData();
    const imagePath = path.resolve(process.cwd(), 'support/image/recipe.jpg');
    const imageStream = fs.createReadStream(imagePath);
    form.append('file', imageStream, {
        filename: 'recipe.jpg',
        contentType: 'image/jpeg'
    });
    const res = await axios.post(url, form, {
        headers: {
            ...form.getHeaders(),
            'Authorization': `Bearer ${token}`,
            'Vidalink-Session-Id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'Accept': 'application/json',
        },
    });
    if (res.status !== 200) {
        throw new Error(`Erro ao anexar arquivo de reembolso: Status ${res.status}`);
    }
    return res.data.data[0].fileData.fileId;
}

export async function validateRequest(token: string, refundId: number, protocol: string, cardNumber: string, purchaseDate: string) {
    const url = `${baseUrl}/rota-endpoint`;
    const payload = {
        "refundId": refundId,
        "CnpjOfPharmacy": "0900836000132",
        "taxCoupon": "346",
        "protocol": protocol,
        "purchaseDate": purchaseDate,
        "cardNumber": cardNumber,
        "userId": "5946"
    };
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(url, payload, params);
    if (response.status !== 200) {
        throw new Error(`Falha ao validar a solicitação: Status ${response.status}`);
    }
    return response.data;
}

export async function quotation(token: string, refundId: number, massa: any, invoiceFileId: number, purchaseDate: string): Promise<string> {
    const url = `${baseUrl}/rota-endpoint`;
    const payload = {
        "operationType": 1,
        "refundId": refundId,
        "purchase": {
            "userName": "DEVELOPER",
            "cardNumber": massa.cardNumber,
            "dataDaDigitacao": "2000-12-08",
            "customerId": massa.CT,
            "storeNumber": "64322178000131",
            "storeNumberTmp": "33431859000023",
            "invoice": invoiceFileId.toString(),
            "dataDaCompra": purchaseDate, // DD/MM/YYYY
            "clientId": "VIDALINK AMIL",
            "clientGroupId": "VIDALINK AMIL"
        },
        "prescription": {
            "products": [{
                "conselhoRegional": "M", "ufConselho": "SP", "numeroDoMedico": "123456",
                "ean": "7896006298571", "quantidadeDeCaixa": "1", "quantidadeDiaria": "20",
                "pmc": 12.40, "precoFarmacia": 12.40, "dataDaReceita": purchaseDate // DD/MM/YYYY
            }],
            "dataDaVenda": purchaseDate // DD/MM/YYYY
        },
        "comprovanteConvenio": "",
        "posConvenio": "",
        "iTipoVenda": 5,
        "impressoraId": 1
    };
    // console.log(new Date().toISOString().split('T')[0]) // YYYY-MM-DD
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Vidalink-Session-Id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(url, payload, params);
    if (response.status !== 200) {
        throw new Error(`Falha na cotação de reembolso: Status ${response.status}`);
    }
    return response.data.data.authorizationCode;
}

export async function authorizeConfirmSales(token: string, authorizationCode: string) {
    const url = `${baseUrl}/rota-endpoint`;
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Vidalink-Session-Id': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'Content-Type': 'application/json',
        },
    };

    const response = await axios.post(url, {}, params);

    if (response.status !== 200) {
        throw new Error(`Falha ao confirmar vendas: Status ${response.status}`);
    }

    return response.data;
}

export async function processRefund(token: string, refundId: number, authorizationCode: string) {
    const url = `${baseUrl}/rota-endpoint`;
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const payload = {
        "refundId": refundId,
        "authorizationCode": authorizationCode,
        "userOperatorRefundId": "5946"
    }

    const response = await axios.post(url, payload, params);

    if (response.status !== 200) {
        throw new Error(`Falha ao processar o reembolso: Status ${response.status}`);
    }

    return response.data;
}

export async function reproveRefund(token: string, refundId: number, protocol: string) {
    const url = `${baseUrl}/rota-endpoint`;
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    };

    const payload = {
        "emailTo": "teste@vidalink.com.br",
        "protocol": protocol,
        "refundId": refundId,
        "userId": "5946",
        "observation": "teste automatizado",
        "selectedMotives": [
            {
                "documentoId": 43,
                "resultadoId": 19
            }
        ]
    }

    const response = await axios.post(url, payload, params);

    if (response.status !== 200) {
        throw new Error(`Falha na reprovação do reembolso: Status ${response.status}`);
    }
}

export async function sendRefundAndApprove(massa: any): Promise<void> {
    const token = await createToken();

    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - 30);
    const formattedPurchaseDate = `${String(purchaseDate.getDate()).padStart(2, '0')}/${String(purchaseDate.getMonth() + 1).padStart(2, '0')}/${purchaseDate.getFullYear()}`;

    const { id: refundId, protocol } = await createRequestRefund(token, massa.CT, massa.cardNumber);
    const invoiceFileId = await uploadRefundFile(token, refundId, 'invoice');
    await uploadRefundFile(token, refundId, 'prescription');
    await validateRequest(token, refundId, protocol, massa.cardNumber, formattedPurchaseDate);
    const authorizationCode = await quotation(token, refundId, massa, invoiceFileId, formattedPurchaseDate);
    await authorizeConfirmSales(token, authorizationCode);
    await processRefund(token, refundId, authorizationCode);
}

export async function sendRefundAndReprove(massa: any): Promise<void> {
    const token = await createToken();

    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - 180);
    const formattedPurchaseDate = `${String(purchaseDate.getDate()).padStart(2, '0')}/${String(purchaseDate.getMonth() + 1).padStart(2, '0')}/${purchaseDate.getFullYear()}`;

    const { id: refundId, protocol } = await createRequestRefund(token, massa.CT, massa.cardNumber);
    await uploadRefundFile(token, refundId, 'invoice');
    await uploadRefundFile(token, refundId, 'prescription');
    await validateRequest(token, refundId, protocol, massa.cardNumber, formattedPurchaseDate);
    await reproveRefund(token, refundId, protocol);
}