import { Request, Response } from "express";
import prisma from "../prisma.js";

export async function listTracks(req: Request, res: Response): Promise<void> {
  try {
    const tracks = await prisma.track.findMany({
      include: {
        trackSkills: {
          include: { skill: true }
        },
        _count: {
          select: { users: true, courses: true, quizzes: true }
        }
      },
      orderBy: { name: "asc" }
    });

    res.json(tracks);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch tracks", details: err.message });
  }
}

export async function getTrackById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        trackSkills: {
          include: { skill: true }
        },
        courses: {
          include: { taggedSkill: true, prerequisiteCourse: true }
        },
        quizzes: {
          include: { skill: true, questions: true }
        }
      }
    });

    if (!track) {
      res.status(404).json({ error: "Track not found" });
      return;
    }

    res.json(track);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch track details", details: err.message });
  }
}
