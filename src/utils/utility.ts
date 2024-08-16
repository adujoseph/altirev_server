import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

async function encryptData(data: string) {
  const iv = randomBytes(8);
  const password = 'altirev_key';
  const key = (await promisify(scrypt)(password, 'salt', 8)) as Buffer;
  const cipher = createCipheriv('aes-256-ctr', key, iv);

  return Buffer.concat([cipher.update(data), cipher.final()]).toString();
}

// async function decryptData(encryptedData: ArrayBufferView) {
//   const iv = randomBytes(8);
//   const password = 'altirev_key';
//   const key = (await promisify(scrypt)(password, 'salt', 8)) as Buffer;
//   const decipher = createDecipheriv('aes-256-ctr', key, iv);
//   const decryptedText = Buffer.concat([
//     decipher.update(encryptedData),
//     decipher.final(),
//   ]);
// }

export { encryptData };
