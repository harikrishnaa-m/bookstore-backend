const books = require("../models/bookModel");
const stripe = require("stripe")(
  "sk_test_51RuT9W2MMbUr2oAY9zKFHL61nl6CdUp1srw2nIT95Cy5WNXqJ6ayTlIw3783z5kWgP9vHs1cIyyvDJmiRBH8fh010071K3Bl5q"
);

exports.addBook = async (req, res) => {
  console.log("inside addbookcontroller");
  const {
    title,
    author,
    noofpages,
    imageUrl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category,
  } = req.body;
  let UploadedImages = []; //the name should be same as defined in routes multerMiddleware.array("UploadedImages",3)
  req.files.map((item) => UploadedImages.push(item.filename));
  console.log(req);
  console.log(req.files); //to ensure multer is working
  // res.status(200).json("Addbook request received");
  const email = req.payload?.userMail;
  try {
    const existingBook = await books.findOne({ title, userMail: email });
    if (existingBook) {
      res.status(401).json("Book already exists");
    } else {
      const newBook = new books({
        title,
        author,
        noofpages,
        imageUrl,
        price,
        dprice,
        abstract,
        publisher,
        language,
        isbn,
        category,
        UploadedImages,
        userMail: email,
      });
      await newBook.save();
      res.status(200).json(newBook);
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while adding book", error: err.message });
  }
};

//get book for homepage
exports.getHomeBooks = async (req, res) => {
  try {
    const homebooks = await books.find().sort({ _id: -1 }).limit(4);
    res.status(200).json(homebooks);
  } catch (error) {
    res.status(500).json("error" + error);
  }
};

//get all books
exports.getAllBooks = async (req, res) => {
  console.log("inside allbooks");
  console.log(req.query);
  const email = req.query.userMail;

  const searchKey = req.query.search;
  try {
    const query = {
      title: {
        $regex: searchKey,
        $options: "i",
      },
      userMail: {
        $ne: email,
      },
    };
    const allbooks = await books.find(query);
    res.status(200).json(allbooks);
  } catch (error) {
    res.status(500).json("error" + error);
  }
};
//get a book by id
exports.getABook = async (req, res) => {
  console.log("inside getabook");
  const { id } = req.params;
  console.log(id);

  try {
    const abook = await books.findOne({ _id: id });
    res.status(200).json(abook);
  } catch (error) {
    res.status(500).json("error" + error);
  }
};

//----------------ADMIN---------------
exports.getAllBookAdminController = async (req, res) => {
  try {
    const allExistingbooks = await books.find();
    res.status(200).json(allExistingbooks);
  } catch (error) {
    res.status(500).json("error" + error);
  }
};

exports.approveBooksAdminController = async (req, res) => {
  const {
    _id,
    title,
    author,
    noofpages,
    imageUrl,
    price,
    dprice,
    abstract,
    publisher,
    language,
    isbn,
    category,
    UploadedImages,
    status,
    userMail,
    brought,
  } = req.body;
  try {
    const existingBook = await books.findByIdAndUpdate(
      { _id },
      {
        title,
        author,
        noofpages,
        imageUrl,
        price,
        dprice,
        abstract,
        publisher,
        language,
        isbn,
        category,
        UploadedImages,
        status: "approved",
        userMail,
        brought,
      },
      { new: true }
    );
    await existingBook.save();
    res.status(200).json(existingBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.makepayment = async (req, res) => {
  console.log("inside make payment");

  const { bookDetails } = req.body;
  console.log(bookDetails);
  const email = req.payload.userMail;
  console.log(email);
  try {
    const existingBook = await books.findByIdAndUpdate(
      { _id: bookDetails._id },
      {
        title: bookDetails.title,
        author: bookDetails.author,
        noofpages: bookDetails.noofpages,
        imageUrl: bookDetails.imageUrl,
        price: bookDetails.price,
        dprice: bookDetails.dprice,
        abstract: bookDetails.abstract,
        publisher: bookDetails.publisher,
        language: bookDetails.language,
        isbn: bookDetails.isbn,
        category: bookDetails.category,
        UploadedImages: bookDetails.UploadedImages,
        status: "sold",
        userMail: bookDetails.userMail,
        brought: email,
      },
      { new: true }
    );
    console.log(existingBook);
    //create line item
    line_item = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: bookDetails.title,
            description: `${bookDetails.author} | ${bookDetails.publisher}`,
            images: [bookDetails.imageUrl],
            metadata: {
              title: bookDetails.title,
              author: bookDetails.author,
              noofpages: bookDetails.noofpages,
              imageUrl: bookDetails.imageUrl,
              price: bookDetails.price,
              dprice: bookDetails.dprice,
              abstract: bookDetails.abstract,
              publisher: bookDetails.publisher, //metadata is not mandatory
              language: bookDetails.language,
              isbn: bookDetails.isbn,
              category: bookDetails.category,
              UploadedImages: bookDetails.UploadedImages,
              status: "sold",
              userMail: bookDetails.userMail,
              brought: email,
            },
          },

          unit_amount: Math.round(bookDetails.dprice * 100),
        },
        quantity: 1,
      },
    ];
    //create checkout session
    const session = await stripe.checkout.sessions.create({
      //purchase using card
      payment_method_types: ["card"],
      //details of book
      line_items: line_item,
      //make payment
      mode: "payment",
      //if payment success
      success_url: "http://localhost:5173/payment-success",
      //if payment fail
      cancel_url: "http://localhost:5173/payment-error",
    });
    console.log(session);
    res.status(200).json({ sessionID: session.id, existingBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
