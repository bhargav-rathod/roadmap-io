import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: { id: id as string }
    })

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' })
    }

    // If structure already exists, return it
    if (roadmap.structure) {
      return res.json(JSON.parse(roadmap.structure))
    }

    // Generate new structure
    const structure = await generateRoadmapStructure(roadmap)
    
    // Update roadmap with structure
    await prisma.roadmap.update({
      where: { id: id as string },
      data: { structure: JSON.stringify(structure) }
    })

    res.json(structure)
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate roadmap structure' })
  }
}