import prisma from "../prisma.js";

export type ActionType =
  | "AUTH_LOGIN"
  | "AUTH_REGISTER"
  | "TRACK_SELECTED"
  | "PROFILE_UPDATED"
  | "ASSESSMENT_SUBMITTED"
  | "SKILL_SELF_RATED"
  | "SCORE_CHANGED"
  | "UPLOAD_PROCESSED"
  | "QUIZ_GENERATED"
  | "QUIZ_ATTEMPTED"
  | "RECOMMENDATION_RECALCULATED";

export async function logActivity(
  actorId: string | null | undefined,
  actionType: ActionType | string,
  metadata: Record<string, any> = {}
) {
  try {
    const entry = await prisma.activityLog.create({
      data: {
        actorId: actorId || null,
        actionType,
        metadata: JSON.stringify(metadata),
        timestamp: new Date()
      }
    });
    return entry;
  } catch (err) {
    console.error(`Failed to write activity log [${actionType}]:`, err);
    return null;
  }
}
