import validate from "npm: uuid-validate";
import { client } from "../../database/database.ts";
import { Comment } from "../../models/comment.ts";

export class DeleteCommentService {
    async execute(comment_id: string, comment_owner_id: string){
      if (!validate(comment_id, 4)) throw new Error("ID de comentário inválido!")

      const queryForFindingComment = `SELECT * FROM public.comments WHERE comment_id = '${comment_id}' LIMIT 1;`
      const {rows: commentFound} = await client.queryObject<Comment>(queryForFindingComment)
      if (!commentFound.length) throw new Error("client: Comentário não encontrado!");
      if (commentFound[0].deleted) throw new Error("client: Comentário já está deletado!");
      if(commentFound[0].comment_owner_id !== comment_owner_id) throw new Error("client: Você não é o dono deste comentário, portanto, não pode apagá-lo.");

      const query = `UPDATE public.comments SET deleted = true WHERE comment_id = '${comment_id}';`
      await client.queryObject(query)
      console.log(`Remoção feita com sucesso\nQuery:\n`, query)
  }
}