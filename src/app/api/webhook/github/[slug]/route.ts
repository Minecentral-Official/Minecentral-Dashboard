import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { slug: resourceId } = req.query;
    res.end(`Post: ${resourceId}`);
  } catch {
    return new Response(`Webhook Error`, { status: 400 });
  }
}
