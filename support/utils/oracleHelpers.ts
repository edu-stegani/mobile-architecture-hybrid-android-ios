import oracledb from 'oracledb'

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

  // Métodos

  async acceptTermAndConditions(socialId: string) {
    const query = `UPDATE IIS.RMB_CLIENTE SET TERMO_ADESAO_ACEITO=6 WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }

  async resetBankData(socialId: string) {
    const query = `UPDATE IIS.RMB_CLIENTE SET CONTA_CORRENTE=NULL, BANCO=NULL, AGENCIA_DV=NULL WHERE CPF=:1`

    return await this.executeQuery(query, [socialId]);
  }
}

export default new OracleHelper()