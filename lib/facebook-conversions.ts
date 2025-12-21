// Facebook Conversions API Helper
// Envia eventos do servidor para o Facebook

interface FacebookEventData {
    event_name: string;
    event_time: number;
    event_source_url: string;
    user_data: {
        em?: string; // email (hashed)
        ph?: string; // phone (hashed)
        client_ip_address?: string;
        client_user_agent?: string;
        fbc?: string; // Facebook click ID
        fbp?: string; // Facebook browser ID
    };
    custom_data?: Record<string, any>;
}

const PIXEL_ID = '1200261848197070';
const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN || '';

// Hash SHA256 para dados sensíveis
async function hashSHA256(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function sendFacebookEvent(eventData: FacebookEventData) {
    if (!ACCESS_TOKEN) {
        console.warn('Facebook Access Token not configured');
        return;
    }

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: [eventData],
                    access_token: ACCESS_TOKEN,
                }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error('Facebook Conversions API error:', result);
        }

        return result;
    } catch (error) {
        console.error('Error sending Facebook event:', error);
    }
}

// Evento: Lead (formulário de contato ou análise de caso)
export async function trackLead(data: {
    email: string;
    phone?: string;
    name?: string;
    eventSourceUrl: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
}) {
    const emailHash = await hashSHA256(data.email);
    const phoneHash = data.phone ? await hashSHA256(data.phone.replace(/\D/g, '')) : undefined;

    return sendFacebookEvent({
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: data.eventSourceUrl,
        user_data: {
            em: emailHash,
            ph: phoneHash,
            client_ip_address: data.clientIp,
            client_user_agent: data.userAgent,
            fbp: data.fbp,
            fbc: data.fbc,
        },
        custom_data: {
            content_name: 'Contact Form',
        },
    });
}

// Evento: Contact (envio de formulário de contato)
export async function trackContact(data: {
    email: string;
    phone?: string;
    eventSourceUrl: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
}) {
    const emailHash = await hashSHA256(data.email);
    const phoneHash = data.phone ? await hashSHA256(data.phone.replace(/\D/g, '')) : undefined;

    return sendFacebookEvent({
        event_name: 'Contact',
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: data.eventSourceUrl,
        user_data: {
            em: emailHash,
            ph: phoneHash,
            client_ip_address: data.clientIp,
            client_user_agent: data.userAgent,
            fbp: data.fbp,
            fbc: data.fbc,
        },
    });
}

// Evento: SubmitApplication (solicitação de análise de caso)
export async function trackCaseAnalysisSubmission(data: {
    email: string;
    phone: string;
    name: string;
    eventSourceUrl: string;
    clientIp?: string;
    userAgent?: string;
    fbp?: string;
    fbc?: string;
}) {
    const emailHash = await hashSHA256(data.email);
    const phoneHash = await hashSHA256(data.phone.replace(/\D/g, ''));

    return sendFacebookEvent({
        event_name: 'SubmitApplication',
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: data.eventSourceUrl,
        user_data: {
            em: emailHash,
            ph: phoneHash,
            client_ip_address: data.clientIp,
            client_user_agent: data.userAgent,
            fbp: data.fbp,
            fbc: data.fbc,
        },
        custom_data: {
            content_name: 'Case Analysis Request',
        },
    });
}
