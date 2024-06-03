const { nanoid } = require("nanoid");
const books = require("./books");


const addBookHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

  if (!name) {
    const response = h.response({
       status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku' });
        response.code(400);
        return response;
    }
   
  if (readPage > pageCount) {
    const response = h.response({
       status: 'fail', 
       message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' });
       response.code(400);
       return response;
  }


  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = { id, name, year, author, summary, publisher, pageCount, readPage, reading, finished, insertedAt, updatedAt };
  books.push(newBook);

  const isSuccess = books.some((book) => book.id === id);
  
  if (isSuccess) {
    return h.response({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: id } }).code(201);
  } else {
    return h.response({ status: 'fail', message: 'Gagal menambahkan buku' }).code(500);
  }
};
 

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filterBooks = books;
  // Terdapat query name
  if (name) {
    //const filteredBooksName = books.filter((book) => {
      filterBooks = filterBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
      const nameRegex = new RegExp(name, 'gi');
      filterBooks = filterBooks.filter((book) => nameRegex.test(book.name));
      //return nameRegex.test(book.name);
    

    const response = h
      .response({
        status: 'success',
        data: {
          books: filterBooks.slice(0,2).map((book) => ({
            bookId: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // Terdapat query reading
  if (reading !== undefined) {
    filterBooks = books.filter((book) => book.reading ===(reading === '1'));//(book.reading) === Number(reading),
     //filterBooks =filterBooks
    const response = h
      .response({
        status: 'success',
        data: {
          book: filterBooks.slice(0,2).map((book) => ({
            bookId: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // Terdapat query finished
  if (finished !== undefined) {
    const finishedStatus = finished === '1';
    filterBooks =filterBooks.filter((book) => book.finished === finishedStatus);
   // const filteredBooksFinished = books.filter(
      //(book) => Number(book.finished) === Number(finished),
     const response = h
      .response({
        status: 'success',
        data: {
          books: filterBooks.map((book) => ({
            bookId: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);

    return response;
  }

  // Tidak terdapat query apapun
  const response = h.response({
      status: 'success',
      data: {
        books: filterBooks.slice(0,2).map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    })
   .code(200);
    return response;

};


const getBookByIdHandler = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((b) => b.id === bookId)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
  if (!bookId) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditentukan',
      })
      .code(400);
    return response;
  }

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex === -1) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      })
      .code(404);
    return response;
  }
 
  if (!name) {
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }
  const updateBook = {
    id: bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    reading,
    finished: pageCount === readPage,
    insertedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  // finished = pageCount === readPage;
  //const updatedAt = new Date().toISOString();

  books[bookIndex] = updateBook;

  const response = h
    .response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
      data: {
        book: updateBook,
      }
    })
    .code(200);
  return response;
};
            
        
const deleteBookByIdHandler = (Request,h) =>{
    const {bookId} =Request.params;
    const index =books.findIndex((books) => books.id === bookId);
    if(index !== -1){
        const deletedBook = books.splice(index,1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
            data: {
               book: deletedBook[0]
            }
        });
        response.code(200);
        return response;
    }
   // const deletedBook = books.splice(index,1);
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
        
        });
        response.code(404);
        return response;

    };


    
    module.exports ={
        addBookHandler,
        getAllBooksHandler,
        getBookByIdHandler,
        editBookByIdHandler,
        deleteBookByIdHandler,
    }

     
    
      
     
  