import md5 from 'md5';

const generateMD5Hash = (str: string) => {
    return md5(str);
};

export default generateMD5Hash;
