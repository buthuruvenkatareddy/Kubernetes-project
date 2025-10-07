import sqlite3 from 'sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { Credential, IssuedCredential } from './types';

export class CredentialDatabase {
  private db: sqlite3.Database;
  private workerId: string;

  constructor(dbPath: string = './credentials.db') {
    this.workerId = process.env.WORKER_ID || `worker-${Math.floor(Math.random() * 1000)}`;
    this.db = new sqlite3.Database(dbPath);
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating table:', err);
      } else {
        console.log('Database initialized successfully');
      }
    });
  }

  async issueCredential(credential: Credential): Promise<IssuedCredential> {
    return new Promise((resolve, reject) => {
      // Check if credential already exists
      const checkQuery = `
        SELECT * FROM credentials 
        WHERE holder_name = ? AND issuer_name = ? AND credential_type = ?
      `;

      this.db.get(
        checkQuery,
        [credential.holderName, credential.issuerName, credential.credentialType],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          if (row) {
            reject(new Error('Credential already issued'));
            return;
          }

          // Issue new credential
          const credentialId = uuidv4();
          const timestamp = new Date().toISOString();
          const issuedCredential: IssuedCredential = {
            ...credential,
            id: credentialId,
            workerId: this.workerId,
            timestamp
          };

          const insertQuery = `
            INSERT INTO credentials 
            (id, holder_name, issuer_name, credential_type, issuance_date, expiration_date, attributes, worker_id, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          this.db.run(
            insertQuery,
            [
              credentialId,
              credential.holderName,
              credential.issuerName,
              credential.credentialType,
              credential.issuanceDate,
              credential.expirationDate || null,
              JSON.stringify(credential.attributes),
              this.workerId,
              timestamp
            ],
            function (err) {
              if (err) {
                reject(err);
              } else {
                resolve(issuedCredential);
              }
            }
          );
        }
      );
    });
  }

  async getCredential(id: string): Promise<IssuedCredential | null> {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM credentials WHERE id = ?';
      
      this.db.get(query, [id], (err, row: any) => {
        if (err) {
          reject(err);
          return;
        }

        if (!row) {
          resolve(null);
          return;
        }

        const credential: IssuedCredential = {
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

        resolve(credential);
      });
    });
  }

  getWorkerId(): string {
    return this.workerId;
  }

  close(): void {
    this.db.close();
  }
}