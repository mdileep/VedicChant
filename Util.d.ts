declare type ajaxActionCallback = (isPreEvent: boolean) => void;
declare type ajaxSuccessCallbackSimple = (response: string) => void;
declare type ajaxSuccessCallback = (response: string, xhr: any) => void;
declare type ajaxErrorCallback = (status: string, response: string, xhr: any) => void;
declare type elementEventListener = (e: any) => void;
declare var Util: {
    ajax(endPoint: string, callBack: ajaxSuccessCallback, ajaxErrorCallback: ajaxErrorCallback, ajaxActionCallback: ajaxActionCallback, httpMethod: string, post: string, contentType: string): void;
    ajax(endPoint: string, callBack: ajaxSuccessCallback, ajaxErrorCallback: ajaxErrorCallback, ajaxActionCallback: ajaxActionCallback, httpMethod: string, post: string): void;
    ajax(endPoint: string, callBack: ajaxSuccessCallback, ajaxErrorCallback: ajaxErrorCallback, ajaxActionCallback: ajaxActionCallback): void;
    ajax(endPoint: string, callBack: ajaxSuccessCallback): void;
    ajax(endPoint: string, callBack: ajaxSuccessCallbackSimple): void;
    registerClick(id: string, elementEventListener: elementEventListener): void;
    deRegisterClick(id: string, elementEventListener: elementEventListener): void;
    registerEvent(E: HTMLElement, eventName: string, elementEventListener: elementEventListener): void;
    deRegisterEvent(E: HTMLElement, eventName: string, elementEventListener: elementEventListener): void;
    registerEvent(window: Window, eventName: string, elementEventListener: elementEventListener): void;
    makeVisible(id: string): void;
    makeHidden(id: string): void;
    makeDisabled(id: string): void;
    makeEnabled(id: string): void;
    getValue(id: string): string;
    selectedValue(id: string): string;
    isChecked(id: string): boolean;
    setValue(id: string, value: string): void;
    createEndPoint(endpoint: string, params: any): string;
    postQuery(params: any, isGet: boolean): string;
    template(html: string, options: any): string;
    random(n: number): number;
}

declare type VedaConfig = {
    samples: string[];
}