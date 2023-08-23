export default async function fetchAPI(url,callback,err){
    try{
        const option = {
            Range:'bytes=0-1024',
        }
        const response = await fetch(url,option);
        if(response.status === 200 || response.status === 206){
            const data = await response.blob();
            callback(data);
        }else{
            err('error:wrong status!!!');
        }
    }catch (e){
        err(e);
    }
}
