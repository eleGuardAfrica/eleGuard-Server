interface IResponse{
    success: boolean;
    body: any;
    error?: any | null;
}

export const CreateResponse = (success: boolean, body: any, error?: any | null) : IResponse=> {
    return {
        success,
        body,
        error: error?.message || error?._message || error || null
    };
}