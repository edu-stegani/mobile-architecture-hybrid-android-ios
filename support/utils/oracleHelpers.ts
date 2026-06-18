import oracledb from 'oracledb'

try {
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_22' });
} catch (err: any) {
  if (!err.message.includes('NJS-102')) { 
    console.error('Erro ao inicializar o Oracle Client:', err);
  }
}

class OracleHelper {
  async executeQuery(query: string, params: any[] = []) {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection({
        user: 'GERENCIADOR',
        password: 'grncdr',
        connectString: '10.10.10.18:1521/DBPROD_PDB1'
      })

      const result = await connection.execute(query, params, { autoCommit: true })

      return result.rowsAffected

    } finally {
      if (connection) {
        await connection.close()
      }
    }
  }

  async executeSelect(query: string, params: any[] = []) {
    let connection: oracledb.Connection | undefined
    try {
      connection = await oracledb.getConnection({
        user: 'GERENCIADOR',
        password: 'grncdr',
        connectString: '10.10.10.18:1521/DBPROD_PDB1'
      })

      const result = await connection.execute(query, params)
      return result.rows; // Aqui retornará as linhas com os dados

    } finally {
      if (connection) {
        await connection.close()
      }
    }
  }

  // Métodos

  async acceptTermAndConditions(socialId: string) {
    const query = `UPDATE IIS.RMB_CLIENTE SET TERMO_ADESAO_ACEITO=6 WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }

  async resetBankData(socialId: string) {
    const query = `UPDATE IIS.RMB_CLIENTE SET CONTA_CORRENTE=NULL, BANCO=NULL, AGENCIA_DV=NULL WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }

  async getLastSMS(socialId: string) {
    const query = `
      SELECT TOKENSMS 
      FROM (
        SELECT TOKENSMS 
        FROM IIS.TOKEN 
        WHERE MEMBER_ID = :1 
          AND DATA >= SYSDATE - (1/1440) 
        ORDER BY DATA DESC
      ) WHERE ROWNUM = 1
    `;
    const rows = await this.executeSelect(query, [socialId]) as any[][];

    if (!rows || rows.length === 0) {
      return null;
    }

    return rows[0][0];
  }
}

export default new OracleHelper()