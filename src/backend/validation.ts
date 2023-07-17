export class ErrorFromValidation extends Error {
    param: string | undefined;
    status: number;
    validationErrors: ValidationError[];
    
    private static msg(validationErrors: ValidationError[]): string {
        if (validationErrors.length == 0) {
            return "Unspecified validation error";
        }
        return validationErrors.map((validationError) => {
            return `${validationError.msg} (${validationError.location} ${validationError.param}, value ${validationError.value})`;
        }).join(". ");
    }
    
    constructor(status: number, validationErrors: ValidationError[]) {
        super(ErrorFromValidation.msg(validationErrors));
        this.status = status;
        this.validationErrors = validationErrors;
    }
}

export class ErrorWithHTML extends Error {
    html: string;
    status: number;

    constructor(status:  number, html: string) {
        super("Error");
        this.status = status;
        let bodyStart = html.indexOf("<body");
        if (bodyStart >= 0) {
            bodyStart = html.indexOf(">", bodyStart);
        }
        const bodyEnd = html.indexOf("</body>", bodyStart);
        if (bodyStart >= 0 && bodyEnd >= 0) {
            this.html = "<div>"+html.substring(bodyStart+1, bodyEnd)+"</div>";
        } else {
            this.html = html;
        }

    }
}

/**
 * ValidationError created by express-validator (without nested errors).
 */
type ValidationError = {
    msg: string;
    param: string;
    location: string;
    value: string;
}

/**
 * Funktioniert wie fetch, parst aber die Antwort als JSON oder wirft eine Exception.
 * 
 * D.h. statt
 * ```
 * const response = await fetch(url, init);
 * const data: DataType = await response.json();
 * return data;
 * ```
 * schreibt man
 * ```
 * const data: DataType = await fetchWithErrorHandling(url, init);
 * return data;
 * ```
 * 
 * 
 * Falls die Antwort ein Validierungsfehler ist (Status 400), wird eine Exception vom Typ `ErrorFromValidation` geworfen.
 * Falls die Antwort ein HTML-Dokument ist (Status 404/500), wird eine Exception vom Typ `ErrorWithHTML` geworfen.
 * 
 * Sowohl `ErrorFromValidation` als auch `ErrorWithHTML` sind von Error abgeleitet,
 * haben eine zusätzliche Eigenschaft `status`
 * und können in der Komponente, die im Fehlerfall angezeigt wird, verwendet werden, um den Fehler genauer anzuzeigen.
 * In `ErrorWithHTML` ist die HTML-Antwort in `html` gespeichert,
 * in `ErrorFromValidation` die Validierungsfehler in `validationErrors`
 */
export async function fetchWithErrorHandling<R>(url: string, init?: RequestInit): Promise<R> {
    
    const response: Response = await fetch(url, init);

    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.startsWith("application/json")) {
        const data = await response.json()
        if (response.ok) {
            return data;
        }
        if (data.errors instanceof Array) {
            const validationErrors = data.errors as ValidationError[];
            throw new ErrorFromValidation(response.status, validationErrors);
        } else {
            throw new Error(`Status ${response.status}: ${JSON.stringify(data)}`);
        }
    } else if (contentType.startsWith("text/html")) {
        const html = await response.text();
        throw new ErrorWithHTML(response.status, html);
    } else if (contentType.startsWith("text/plain")) {
        const text = await response.text();
        throw new Error(`Status ${response.status}: ${text}`);
    }

    if (response.ok) {
        return undefined as unknown as R;
    }
    throw new Error(`Status ${response.status}`);
    
}