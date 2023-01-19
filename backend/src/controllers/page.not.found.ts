import { ctxModel } from "../models/context.ts";

export const pageNotFound = function (context: ctxModel) {      
  context.response.status = 404;
  context.response.body = {message: "Página não encontrada!"}
}