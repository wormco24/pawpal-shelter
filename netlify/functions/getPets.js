const contentful = require('contentful');

exports.handler = async function () {
  const client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  });

  try {
    const response = await client.getEntries({ content_type: 'pawPalShelter' });

    const pets = response.items.map(item => {
      const imageUrl = item.fields.image?.fields?.file?.url
        ? 'https:' + item.fields.image.fields.file.url
        : null;

      return {
        name: item.fields.name || '',
        species: item.fields.species || '',
        breed: item.fields.breed || '',
        age: item.fields.age || '',
        description: item.fields.description || '',
        image: imageUrl
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(pets)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
