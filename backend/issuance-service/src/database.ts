import { Pool, PoolClient } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { Credential, IssuedCredential } from './types';

export class CredentialDatabase {
  private pool: Pool;
  private workerId: string;

  constructor() {
    this.workerId = process.env.WORKER_ID || `worker-${Math.floor(Math.random() * 1000)}`;
    
    // PostgreSQL connection configuration
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/credentials',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const client = await this.pool.connect();
    try {
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS credentials (
          id TEXT PRIMARY KEY,
          holder_name TEXT NOT NULL,
          issuer_name TEXT NOT NULL,
          credential_type TEXT NOT NULL,
          issuance_date TEXT NOT NULL,
          expiration_date TEXT,
          attributes TEXT NOT NULL,
          worker_id TEXT NOT NULL,
          timestamp TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;

      await client.query(createTableQuery);
      console.log('PostgreSQL database initialized successfully');
    } catch (err) {
      console.error('Error creating table:', err);
    } finally {
      client.release();
    }
  }

  async issueCredential(credential: Credential): Promise<IssuedCredential> {
    const client = await this.pool.connect();
    try {
      // Check if credential already exists
      const checkQuery = `
        SELECT * FROM credentials 
        WHERE holder_name = $1 AND issuer_name = $2 AND credential_type = $3
      `;

      const existingResult = await client.query(
        checkQuery,
        [credential.holderName, credential.issuerName, credential.credentialType]
      );

      if (existingResult.rows.length > 0) {
        throw new Error('Credential already exists for this holder');
      }

      // Issue new credential
      const credentialId = uuidv4();
      const timestamp = new Date().toISOString();

      const insertQuery = `
        INSERT INTO credentials (
          id, holder_name, issuer_name, credential_type, 
          issuance_date, expiration_date, attributes, 
          worker_id, timestamp
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const insertResult = await client.query(insertQuery, [
        credentialId,
        credential.holderName,
        credential.issuerName,
        credential.credentialType,
        credential.issuanceDate,
        credential.expirationDate,
        JSON.stringify(credential.attributes),
        this.workerId,
        timestamp
      ]);

      const issuedCredential: IssuedCredential = {
        id: credentialId,
        holderName: credential.holderName,
        issuerName: credential.issuerName,
        credentialType: credential.credentialType,
        issuanceDate: credential.issuanceDate,
        expirationDate: credential.expirationDate,
        attributes: credential.attributes,
        workerId: this.workerId,
        timestamp: timestamp
      };

      console.log(`Credential ${credentialId} issued successfully by ${this.workerId}`);
      return issuedCredential;

    } catch (error) {
      console.error('Error issuing credential:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getCredential(id: string): Promise<IssuedCredential | null> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM credentials WHERE id = $1';
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        holderName: row.holder_name,
        issuerName: row.issuer_name,
        credentialType: row.credential_type,
        issuanceDate: row.issuance_date,
        expirationDate: row.expiration_date,
        attributes: JSON.parse(row.attributes),
        workerId: row.worker_id,
        timestamp: row.timestamp
      };
    } catch (error) {
      console.error('Error retrieving credential:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllCredentials(): Promise<IssuedCredential[]> {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM credentials ORDER BY created_at DESC';
      const result = await client.query(query);

      return result.rows.map((row: any) => ({
        id: row.id,
        holderName: row.holder_name,
        issuerName: row.issuer_name,
        credentialType: row.credential_type,
        issuanceDate: row.issuance_date,
        expirationDate: row.expiration_date,
        attributes: JSON.parse(row.attributes),
        workerId: row.worker_id,
        timestamp: row.timestamp
      }));
    } catch (error) {
      console.error('Error retrieving credentials:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  getWorkerId(): string {
    return this.workerId;
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('Database connection pool closed');
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } catch (error) {
      console.error('Database health check failed:', error);
      return false;
    } finally {
      client.release();
    }
  }
}