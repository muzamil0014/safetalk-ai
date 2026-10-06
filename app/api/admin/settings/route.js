// ============================================================
// SAFETALK AI
// SETTINGS API
// ============================================================

import Settings
  from "@/models/Settings";

import {
  requireRoles,
} from "@/lib/authorization";

import {
  apiSuccess,
  apiError,
} from "@/lib/apiResponse";


// ============================================================
// GET SETTINGS
// ============================================================

export async function GET() {

  try {

    const auth =
      await requireRoles([
        "Admin",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    let settings =
      await Settings.findOne({
        key: "main",
      });


    if (!settings) {

      settings =
        await Settings.create({
          key: "main",
        });

    }


    return apiSuccess({
      settings,
    });

  } catch {

    return apiError(
      "Unable to load settings."
    );
  }
}


// ============================================================
// UPDATE SETTINGS
// ============================================================

export async function PATCH(
  request
) {

  try {

    const auth =
      await requireRoles([
        "Admin",
      ]);


    if (!auth.allowed) {

      return apiError(
        auth.message,
        auth.status
      );

    }


    const body =
      await request.json();


    const high =
      Number(
        body.highRiskThreshold
      );


    const critical =
      Number(
        body.criticalRiskThreshold
      );


    if (
      high < 0 ||
      high > 100 ||
      critical < 0 ||
      critical > 100 ||
      critical <= high
    ) {

      return apiError(
        "Critical threshold must be greater than high threshold and both must be between 0 and 100.",
        400
      );

    }


    const settings =
      await Settings.findOneAndUpdate(

        {
          key: "main",
        },

        {

          appName:
            body.appName,

          defaultLanguage:
            body.defaultLanguage,

          notifications:
            Boolean(
              body.notifications
            ),

          criticalAlerts:
            Boolean(
              body.criticalAlerts
            ),

          highRiskThreshold:
            high,

          criticalRiskThreshold:
            critical,

        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }

      );


    return apiSuccess({

      message:
        "Settings saved.",

      settings,

    });

  } catch (error) {

    console.error(
      error
    );


    return apiError(
      "Unable to save settings."
    );
  }
}