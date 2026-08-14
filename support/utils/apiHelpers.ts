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

export async function createRequestRefund(token: string, customerId: string, cardNumber: string): Promise<{ id: number, protocol: string }> {
    const url = `${baseUrl}/v1.0/refund?customerId=${customerId}&cardNumber=${cardNumber}`;
    // const payload = {
    //     "motiveId": 45, 
    //     "products": ["Produto de Teste API"]
    // };

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
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
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
    const url = `${baseUrl}/v1.0/refund/${refundId}/file?type=${fileType}`;
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
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
            'Accept': 'application/json',
        },
    });
    if (res.status !== 200) {
        throw new Error(`Erro ao anexar arquivo de reembolso: Status ${res.status}`);
    }
    return res.data.data[0].fileData.fileId;
}

export async function validateRequest(token: string, refundId: number, protocol: string, cardNumber: string, purchaseDate: string) {
    const url = `${baseUrl}/v2/refund/validate-request`;
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
    const url = `${baseUrl}/v1.1/authorization/refund/quotation`;
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
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
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
    const url = `${baseUrl}/v1.1/authorization/refund/authorize-confirm-sales/${authorizationCode}`;
    const params = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Vidalink-Session-Id': 'a01170e8-4481-40b6-b970-7184195f25de',
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
    const url = `${baseUrl}/v2/refund/set-authorization`;
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
    const url = `${baseUrl}/v2/refund/disapprove`;

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
    // console.log(`[API] Iniciando fluxo de aprovação de reembolso para ${massa.fullName}`);
    const token = await createToken();

    const purchaseDate = new Date();
    purchaseDate.setDate(purchaseDate.getDate() - 30);
    const formattedPurchaseDate = `${String(purchaseDate.getDate()).padStart(2, '0')}/${String(purchaseDate.getMonth() + 1).padStart(2, '0')}/${purchaseDate.getFullYear()}`;

    // Criar solicitação de reembolso
    const { id: refundId, protocol } = await createRequestRefund(token, massa.CT, massa.cardNumber);
    // console.log(`[API] Solicitação de reembolso criada: ID ${refundId}, Protocolo ${protocol}`);

    // Fazer upload dos arquivos
    const invoiceFileId = await uploadRefundFile(token, refundId, 'invoice');
    // console.log(`[API] Upload do cupom fiscal (invoice) concluído. File ID: ${invoiceFileId}`);
    await uploadRefundFile(token, refundId, 'prescription');
    // console.log(`[API] Upload da receita (prescription) concluído.`);

    // Validar a solicitação
    await validateRequest(token, refundId, protocol, massa.cardNumber, formattedPurchaseDate);
    // console.log(`[API] Validação da solicitação concluída.`);

    // Fazer a cotação
    const authorizationCode = await quotation(token, refundId, massa, invoiceFileId, formattedPurchaseDate);
    // console.log(`[API] Cotação realizada. Código de autorização: ${authorizationCode}`);

    // Confirmar a venda e processar o reembolso
    await authorizeConfirmSales(token, authorizationCode);
    await processRefund(token, refundId, authorizationCode);
    // console.log(`[API] Reembolso processado e aprovado com sucesso!`);
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