import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

export type TargetDb = 'login' | 'benefit';

class DbHelper {
    private pools: Record<TargetDb, Pool>;

    constructor() {
        this.pools = {
            login: new Pool({
                user: process.env.DB_LOGIN_USER,
                host: process.env.DB_LOGIN_HOST,
                database: 'postgres',
                password: process.env.DB_LOGIN_PASSWORD,
                port: 5432,
            }),
            benefit: new Pool({
                user: process.env.DB_BENEFIT_USER,
                host: process.env.DB_BENEFIT_HOST,
                database: 'postgres',
                password: process.env.DB_BENEFIT_PASSWORD,
                port: 5432,
            })
        };
    }

    async executeQuery(target: TargetDb, query: string, params?: any[]) {
        const pool = this.pools[target];
        const client = await pool.connect();
        try {
            const res = await client.query(query, params);
            return res.rows;
        } finally {
            client.release(); // Libera a conexão de volta para o pool
        }
    }

    async disconnect() {
        const keys = Object.keys(this.pools) as TargetDb[];
        for (const key of keys) {
            await this.pools[key].end();
        }
    }

    // metodos 

    async resetPasswordCount(count: number, socialId: string) {
        const query = `UPDATE login.users SET invalidpasswordcount = $1 WHERE socialid = $2`;

        return await this.executeQuery('login', query, [count, socialId]);
    }

    async updatePasswordForWeakPass(socialId: string) {
        const query = `UPDATE login.users SET "password" = 'lcxPQnjvA78=' WHERE socialid = $1`;

        return await this.executeQuery('login', query, [socialId]);
    }

    async updatePasswordForStrong(socialId: string) {
        const query = `UPDATE login.users SET "password" = 'fkd18oQxC4cypDiYRsC23Q==' WHERE socialid = $1`;

        return await this.executeQuery('login', query, [socialId]);
    }

    async updateRecognitionFace(facerecognitiontype: string, CT: string) {
        const query = `UPDATE login.face_recognition_configuration SET facerecognitiontype= $1 WHERE customerid= $2;`;

        return await this.executeQuery('login', query, [facerecognitiontype, CT]);
    }

    async deleteUserBySocialId(socialId: string) {
        const query = `DELETE FROM login.users WHERE socialid = $1`;

        return await this.executeQuery('login', query, [socialId]);
    }

    async freeUpPhoneNumber(phoneNumber: string = '11958048513'): Promise<void> {
        
        const selectQuery = `SELECT socialid FROM login.users WHERE phonenumber = $1;`;
        const rows = await this.executeQuery('login', selectQuery, [phoneNumber]);

        if (rows && rows.length > 0) {
            const randomPhone = `119${Math.floor(10000000 + Math.random() * 90000000)}`;
            const userToUpdate = rows[0];

            const updateQuery = `UPDATE login.users SET phonenumber = $1 WHERE socialid = $2;`;

            await this.executeQuery('login', updateQuery, [randomPhone, userToUpdate.socialid]);
            console.log(`[DB] Telefone ${phoneNumber} liberado! O CPF ${userToUpdate.socialid} agora usa ${randomPhone}.`);
        }
    }

    async removeLinkTutorialWithCT(cd_tutorial: string, ct: string) {
        const query = `DELETE FROM public.tutorial_ct WHERE cd_tutorial= $1 AND ct= $2;`;

        return await this.executeQuery('benefit', query, [cd_tutorial, ct]);
    }

}

export default new DbHelper();