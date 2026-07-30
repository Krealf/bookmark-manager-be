// import { NextFunction, Request, Response } from 'express';
//
// import { NotFoundError } from '../errors/not-found-error';
// import { BookmarksService } from '../bookmarks/bookmarks.service';
//
// // Контроллер bookmarks
// export const BookmarksController = {
//   // Метод getAll, который принимает пропсы Request и Response для принятия запроса и ответа на него
//   async getAll(_req: Request, res: Response) {
//     try {
//       const bookmarks = await BookmarksService.findAll();
//
//       res.json(bookmarks);
//     } catch (error) {
//       if (
//         error instanceof PrismaClientKnownRequestError &&
//         error.code === 'P2025'
//       ) {
//         throw new NotFoundError('Bookmark not found');
//       }
//
//       throw error;
//     }
//   },
//
//   // Контроллер обновления Bookmark по ID
//   async updateBookmarkById(
//     request: Request<{ id: string }>,
//     res: Response,
//     _: NextFunction,
//   ) {
//     // Читаем ID из запроса
//     const id = request.params.id;
//     // Получаем body из запроса
//     const dto = request.body;
//
//     try {
//       // Получаем обновлённую Bookmark
//       const updated = await BookmarksService.update(id, dto);
//
//       // Возвращаем в виде ответа Bookmark
//       res.json(updated);
//     } catch (error) {
//       if (
//         error instanceof PrismaClientKnownRequestError &&
//         error.code === 'P2025'
//       ) {
//         throw new NotFoundError('Bookmark not found');
//       }
//
//       throw error;
//     }
//   },
//
//   // Контроллер удаления Bookmark по ID
//   async deleteBookmarkById(
//     request: Request<{ id: string }>,
//     res: Response,
//     _: NextFunction,
//   ) {
//     // Читаем ID из запроса
//     const id = request.params.id;
//
//     try {
//       // Получаем результат удаления Bookmark
//       const result = await BookmarksService.delete(id);
//
//       // Возвращаем ответ
//       res.json(result);
//     } catch (error) {
//       if (
//         error instanceof PrismaClientKnownRequestError &&
//         error.code === 'P2025'
//       ) {
//         throw new NotFoundError('Bookmark not found');
//       }
//
//       throw error;
//     }
//   },
//
//   async createBookmark(request: Request, res: Response, next: NextFunction) {
//     const dto = request.body;
//
//     try {
//       // Получаем результат создания Bookmark
//       const result = await BookmarksService.create(dto);
//
//       // Возвращаем ответ
//       res.status(201).json(result);
//     } catch (error) {
//       next(error);
//     }
//   },
// };
