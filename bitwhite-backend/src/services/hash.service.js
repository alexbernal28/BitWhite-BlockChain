import { createHash } from 'crypto';

/**
 * Calcula el hash SHA-256 de un buffer (contenido de un archivo) y lo
 * devuelve en formato hexadecimal, tal como se registra en
 * Tender.documentHash / ProposalDocument.documentHash.
 */
export function sha256Buffer(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}
