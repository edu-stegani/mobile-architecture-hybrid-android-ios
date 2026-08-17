<<<<<<< HEAD
import oracledb from 'oracledb';
import os from 'os';

try {
  if (os.platform() === 'win32') {
    // Windows precisa do caminho explícito
    oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_21_22' });
  } else {
    // macOS e Linux buscam o client automaticamente do sistema
    oracledb.initOracleClient();
  }
} catch (err: any) {
  if (!err.message.includes('NJS-102')) {
    console.error('LOG_ORACLE_ERRO:', err.message);
  }
}
=======
import oracledb from 'oracledb'
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f

class OracleHelper {
  async executeQuery(query: string, params: any[] = []) {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection({
<<<<<<< HEAD
        user: 'XXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXX',
        connectString: 'host:port/XXXXXXXXX'
      })

      const result = await connection.execute(query, params, { autoCommit: true })
=======
        user: 'username',
        password: 'password',
        connectString: '11.11.11.11:1234/password'
      })

      const result = await connection.execute(query, params, {autoCommit: true})
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f

      return result.rowsAffected

    } finally {
      if (connection) {
        await connection.close()
      }
    }
  }

<<<<<<< HEAD
  async executeSelect(query: string, params: any[] = []) {
    let connection: oracledb.Connection | undefined
    try {
      connection = await oracledb.getConnection({
        user: 'XXXXXXXXXXXXXX',
        password: 'XXXXXXXXXXX',
        connectString: 'host:port/XXXXXXXXX'
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
    const query = `UPDATE IIS.TABELA_EXEMPLO SET PARAMETRO_EXEMPLO=6 WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }

  async resetTermAndConditions(socialId: string) {
    const query = `UPDATE IIS.TABELA_EXEMPLO SET PARAMETRO_EXEMPLO=NULL WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }

  async resetBankData(socialId: string) {
    const query = `UPDATE IIS.TABELA_EXEMPLO SET PARAMETRO_EXEMPLO=NULL, PARAMETRO_EXEMPLO_2=NULL, PARAMETRO_EXEMPLO_3=NULL WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }

  async getLastSMS(socialId: string) {
    const query = `
      SELECT TABELA_EXEMPLO 
      FROM (
        SELECT TABELA_EXEMPLO 
        FROM IIS.TABELA_EXEMPLO 
        WHERE PARAMETRO_EXEMPLO = :1 
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
=======
  // Métodos

  async acceptTermAndConditions(socialId: string) {
        const query = `UPDATE IIS.RMB_CLIENTE SET TERMO_ADESAO_ACEITO=6 WHERE CPF=:1`

        return await this.executeQuery(query, [socialId]);
    }
>>>>>>> ce270225ab302744831f1e85ab4a8e3988109e0f
}

export default new OracleHelper()