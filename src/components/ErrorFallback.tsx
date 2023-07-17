import { JsxElement } from "typescript";
import { ErrorFromValidation, ErrorWithHTML } from "../backend/validation";
import { removeJWT } from "../JWTManager";

/**
 * Diese Komponente wird von der Komponente ErrorBoundary der Bibliothek react-error-boundary
 * verwendet, um den Fehler anzuzeigen.
 */
export default function ErrorFallback({error}: {error: Error}) {
  if(error instanceof ErrorWithHTML){
    if(error.status === 401){
      removeJWT();
    }
    return (
      <div>
        <h1>Something went wrong:</h1>
        <pre>Errorname: {error.name}</pre>
        <pre>Errorstatus: {error.status}</pre>
        <pre>Errormessage: {error.message}</pre>
        <pre>Errorhtml: {error.html}</pre>
        <pre>Errorstack: {error.stack}</pre>
      </div>
    )
  } else if(error instanceof ErrorFromValidation){
    if(error.status === 401){
      removeJWT();
    }
    return (
      <div>
        <h1>Something went wrong:</h1>
        <pre>Errorname: {error.name}</pre>
        <pre>Errorstatus: {error.status}</pre>
        <pre>Errormessage: {error.message}</pre>
        <pre>Errorstack: {error.stack}</pre>
      </div>
    )
  }
  return (
    <div>
      <h1>Something went wrong:</h1>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
    </div>
  )
}