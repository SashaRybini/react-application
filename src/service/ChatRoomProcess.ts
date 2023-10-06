import { Request } from "../components/pages/Correspondence";
import MessageType from "../model/MessageType";

export function filterMessages(request: Request, messages: any, clientFrom: string, clientTo: string) {
    let res: MessageType[] = []
    
    if (messages) {
        //clientTo is empty string in case of admin role 'eye' - otherwise filter will clear everything
        
        const sentDb: MessageType[] = messages.sent //sent by me
        const receivedDbByMe: MessageType[] = messages.receivedByMe //my received
        const receivedDbByTo: MessageType[] = messages.receivedByTo //receiced from companion (to know that is has messages from me to all received by companion)

        if (request.sent) {
            const sent = clientTo ? sentDb.filter(m => m.to == clientTo) : sentDb
            res.push(...sent)
            if (request.includeToAll) { //дополнительный пуш
                res.push(...receivedDbByTo.filter(m => m.from == clientFrom && m.to == 'all'))
            }
        }
        if (request.received) {           
            let received = clientTo ? receivedDbByMe.filter(m => m.from == clientTo) : receivedDbByMe
            if (!request.includeToAll) { //дополнительный фильтр
                received = received.filter(m => m.to != 'all')
            }
            res.push(...received)
        }

        res = res.filter(m => new Date(m.date) > new Date(request.dateFrom) && new Date(m.date) < new Date(request.dateTo))
        //объединить фильтры
        res = res.filter(m => m.text.includes(request.someText))

        res = res.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
    }
    return res
}