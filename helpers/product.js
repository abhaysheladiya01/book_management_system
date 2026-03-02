exports.mapProductData = (body, userId, imageUrl = null) => ({
  title: body.title,
  price: body.price,
  description: body.description,
  imageUrl: imageUrl || body.imageUrl,
  userId
});
