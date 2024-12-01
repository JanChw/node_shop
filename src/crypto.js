import CryptoJS from 'crypto-js'

// 密钥
const secretKey = 'mySecretKey123'; // 确保密钥足够复杂

function encryptObject(str) {
    // const jsonString = JSON.stringify(obj);
    const encrypted = CryptoJS.AES.encrypt(str, secretKey).toString();
    return encrypted;
}

function decryptObject(encryptedString) {
    const bytes = CryptoJS.AES.decrypt(encryptedString, secretKey);
    const decryptedJsonString = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedJsonString;
}

// 示例对象
const my = 'janchow@foxmail.com'

// 加密对象
const encrypted = encryptObject(my);
console.log('Encrypted:', encrypted);

// 解密对象
const decrypted = decryptObject(encrypted);
console.log('Decrypted:', decrypted);