import axios from "axios";

/**
 * axios 를 xhr 이라는 이름으로 wrapping 하여 사용한다.
 * 왜냐하면 어떠한 공통 header 가 필요할 수도 있고,
 * 어떠한 공통 전/후처리가 필요할 수 있기 때문이다.
 *
 * 또한 axios 가 아닌 다른 xhr 라이브러리를 사용할 수 있겠으나,
 * 지금은 axios 의 멤버 함수를 사용하고 있으니 그건 나중의 이야기다.
 */
// export const xhr = axios.create({
//     headers: {
//         nodeEnv: process.env.NODE_ENV
//     }
// })

const fetchClient = () => {

    let instance = axios.create({
        headers:{
            nodeEnv : process.env.NODE_ENV
        }
    });

    instance.interceptors.request.use(function (config) {
        let token:string = ``
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('token') as string;
        }
        config.headers!.token =  token ? token : '';

        return config;
    });

    return instance;
};
export const xhr = fetchClient()