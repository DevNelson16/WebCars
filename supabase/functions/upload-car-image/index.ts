import { createClient } from 'npm:@supabase/supabase-js@2'
import { createRemoteJWKSet, jwtVerify } from 'npm:jose@5'

const FIREBASE_PROJECT_ID = 'webcarros-93834'

const FIREBASE_ISSUER = `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  )
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    })
  }

  if (req.method !== 'POST') {
    return Response.json(
      { error: 'Método não permitido.' },
      { status: 405, headers: corsHeaders }
    )
  }

  try {
    // 1. Obter o token enviado pelo Firebase
    const authorization = req.headers.get('Authorization')

    if (!authorization?.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Token de autenticação em falta.' },
        { status: 401, headers: corsHeaders }
      )
    }

    const token = authorization.slice(7)

    // 2. Validar o token do Firebase
    const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
      issuer: FIREBASE_ISSUER,
      audience: FIREBASE_PROJECT_ID,
      algorithms: ['RS256']
    })

    if (typeof payload.sub !== 'string' || !payload.sub) {
      return Response.json(
        { error: 'Utilizador inválido.' },
        { status: 401, headers: corsHeaders }
      )
    }

    // O UID vem do token validado, não do formulário.
    const userId = payload.sub

    // 3. Obter a imagem enviada pelo frontend
    const formData = await req.formData()
    const image = formData.get('image')

    if (!(image instanceof File)) {
      return Response.json(
        { error: 'Nenhuma imagem foi enviada.' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 4. Validar o tipo e o tamanho da imagem
    const allowedTypes = ['image/jpeg', 'image/png']

    if (!allowedTypes.includes(image.type)) {
      return Response.json(
        { error: 'A imagem deve ser JPEG ou PNG.' },
        { status: 400, headers: corsHeaders }
      )
    }

    const maxSize = 5 * 1024 * 1024

    if (image.size > maxSize) {
      return Response.json(
        { error: 'A imagem não pode ultrapassar 5 MB.' },
        { status: 400, headers: corsHeaders }
      )
    }

    // 5. Obter a chave secreta do Supabase
    const secretKeys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseSecretKey =
      Deno.env.get('SUPABASE_SECRET_KEY') ??
      secretKeys.default ??
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseSecretKey) {
      throw new Error('Configuração do Supabase indisponível.')
    }

    // Esta chave fica exclusivamente no servidor.
    const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    })

    // 6. Criar um caminho associado ao UID autenticado
    const extension = image.type === 'image/png' ? 'png' : 'jpg'

    const fileName = crypto.randomUUID()

    const filePath = `${userId}/${fileName}.${extension}`

    // 7. Enviar a imagem para o Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('car-images')
      .upload(filePath, image, {
        contentType: image.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Erro de upload:', uploadError.message)

      return Response.json(
        { error: 'Não foi possível guardar a imagem.' },
        { status: 500, headers: corsHeaders }
      )
    }

    // 8. Devolver o caminho e o endereço da imagem
    const { data } = supabaseAdmin.storage
      .from('car-images')
      .getPublicUrl(filePath)

    return Response.json(
      {
        message: 'Imagem enviada com sucesso.',
        path: filePath,
        publicUrl: data.publicUrl
      },
      {
        status: 200,
        headers: corsHeaders
      }
    )
  } catch (error) {
    console.error('Erro na função:', error)

    return Response.json(
      { error: 'Não foi possível autenticar ou enviar a imagem.' },
      { status: 401, headers: corsHeaders }
    )
  }
})
