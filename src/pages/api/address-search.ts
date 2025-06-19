import type { NextApiRequest, NextApiResponse } from 'next';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  console.log(req.body);
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const { stdout } = await execAsync(`python address_search.py "${address}"`);
    const result = JSON.parse(stdout);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Address search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
