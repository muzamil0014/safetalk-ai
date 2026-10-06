// ============================================================
// SAFETALK AI
// NOTIFICATIONS API
// ============================================================

import Notification
  from "@/models/Notification";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
} from "@/lib/apiResponse";


// ============================================================
// GET NOTIFICATIONS
// ============================================================

export async function GET() {

  try {

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const [
      notifications,
      unread,
    ] =
      await Promise.all([

        Notification
          .find()
          .sort({
            createdAt: -1,
          })
          .limit(20),

        Notification.countDocuments({
          read: false,
        }),

      ]);


    return apiSuccess({

      notifications,
      unread,

    });

  } catch {

    return apiError(
      "Unable to load notifications."
    );
  }
}


// ============================================================
// MARK READ
// ============================================================

export async function PATCH(
  request
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
        "Analyst",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const body =
      await request.json();


    if (
      body.markAll === true
    ) {

      await Notification.updateMany(

        {
          read: false,
        },

        {
          read: true,
        }

      );

    } else if (body.id) {

      await Notification.findByIdAndUpdate(
        body.id,
        {
          read: true,
        }
      );

    }


    return apiSuccess({

      message:
        "Notifications updated.",

    });

  } catch {

    return apiError(
      "Unable to update notification."
    );
  }
}