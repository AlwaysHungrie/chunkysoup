import { generateImage } from './services/imageGenerate'
import { getS3Url, uploadImageToS3, uploadMetadataToS3 } from './services/s3'
import { mintNft } from './services/nft'
import { checkIfIngredientsExist } from './services/ingredients'

interface GenerateImageRequest {
  ingredients: string[]
  address: string
  forceGenerate?: boolean
}

interface LambdaResponse {
  error: string | null
  jsonResult: any
}

export const handler = async (event: any): Promise<LambdaResponse> => {
  try {
    const {
      ingredients,
      address,
      forceGenerate = false,
    } = event as GenerateImageRequest

    if (
      !ingredients ||
      ingredients.length === 0 ||
      !Array.isArray(ingredients)
    ) {
      throw new Error('Ingredients are required')
    }

    if (!address) {
      throw new Error('Address is required')
    }

    const missingIngredients = await checkIfIngredientsExist(ingredients)
    if (missingIngredients.length > 0) {
      throw new Error(`Ingredients missing: ${missingIngredients.join(', ')}`)
    }

    let { s3Url = null, filename = null } = await getS3Url(ingredients)
    if (!s3Url || forceGenerate) {
      console.log('Generating new image')
      const imageUrl = await generateImage(ingredients)

      if (!imageUrl) {
        throw new Error('Failed to generate image')
      }

      const { s3Url: newS3Url, filename: newFilename } = await uploadImageToS3(ingredients, imageUrl, forceGenerate)
      if (!newS3Url) {
        throw new Error('Failed to upload image to S3')
      }

      s3Url = newS3Url
      filename = newFilename
    }

    const { s3MetadataUrl } = await uploadMetadataToS3(ingredients, s3Url)
    if (!s3MetadataUrl) {
      throw new Error('Failed to upload metadata to S3')
    }

    const { txnHash, tokenId } = await mintNft(address, s3MetadataUrl)
    const result = {
      success: true,
      message: 'Image generated and saved to S3',
      s3Url,
      s3MetadataUrl,
      tokenId,
      txnHash,
    }

    return {
      error: null,
      jsonResult: result,
    }
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : 'Unknown error',
      jsonResult: null,
    }
  }
}

// (async () => {
//   const result = await handler({
//     ingredients: ['tomatoes'],
//     address: '0x43Cb32825f0A1CBaC2fd6B11a18f46aa81D142f4',
//     forceGenerate: true,
//   })
  
//   console.log(result)
// })()