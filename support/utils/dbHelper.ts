import { Pool } from 'pg';

class DbHelper {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: 'postgres',
            host: 'login-psql-dev.vidalink.com.br',
            database: 'postgres',
            password: 'pS8WrFMkeyXK',
            port: 5432,
        });
    }

    async executeQuery(query: string, params?: any[]) {
        const client = await this.pool.connect();
        try {
            const res = await client.query(query, params);
            return res.rows;
        } finally {
            client.release(); // Libera a conexão de volta para o pool
        }
    }

    async disconnect() {
        await this.pool.end();
    }

    // metodos 

    async simpleResetPasswordCount(count: number, socialId: string) {
        const query = `UPDATE login.users SET invalidpasswordcount = $1 WHERE socialid = $2`;

        return await this.executeQuery(query, [count, socialId]);
    }

    async updatePasswordForWeakPass(socialId: string) {
        const query = `UPDATE login.users SET "password" = 'lcxPQnjvA78=' WHERE socialid = $1`;

        return await this.executeQuery(query, [socialId]);
    }

    async updatePasswordForStrong(socialId: string) {
        const query = `UPDATE login.users SET "password" = 'fkd18oQxC4cypDiYRsC23Q==' WHERE socialid = $1`;

        return await this.executeQuery(query, [socialId]);
    }

}

export default new DbHelper();