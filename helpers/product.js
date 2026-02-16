exports.mapProductData = (body, userId) => ({
  title: body.title,
  price: body.price,
  description: body.description,
  imageUrl: body.imageUrl,
  userId
});
