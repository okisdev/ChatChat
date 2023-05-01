import axios from 'axios';

const checkOpenAIReachable = async (): Promise<boolean> => {
    try {
        const response = await axios.options('https://api.openai.com/v1/chat/completions?_timestamp=' + new Date().valueOf(), {});
        if (response.status === 200) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};

export default checkOpenAIReachable;
