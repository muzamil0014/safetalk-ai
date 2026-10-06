// ============================================================
// SAFETALK AI
// AUTHENTICATION HELPERS
// ============================================================

import {
  SignJWT,
  jwtVerify,
} from "jose";

import { cookies } from "next/headers";


// ============================================================
// JWT SECRET
// ============================================================

const JWT_SECRET =
  process.env.JWT_SECRET;


if (!JWT_SECRET) {

  throw new Error(
    "JWT_SECRET is missing from .env.local"
  );

}


// ============================================================
// CONVERT SECRET TO UINT8 ARRAY
// ============================================================

const secretKey =
  new TextEncoder().encode(
    JWT_SECRET
  );


// ============================================================
// CREATE JWT TOKEN
// ============================================================

export async function createToken(
  payload
) {

  return await new SignJWT(payload)

    .setProtectedHeader({
      alg: "HS256",
    })

    .setIssuedAt()

    .setExpirationTime("7d")

    .sign(secretKey);
}


// ============================================================
// VERIFY TOKEN
// ============================================================

export async function verifyToken(
  token
) {

  try {

    const { payload } =
      await jwtVerify(
        token,
        secretKey
      );


    return payload;

  } catch (error) {

    return null;

  }

}


// ============================================================
// GET LOGGED IN SESSION
// ============================================================

export async function getSession() {

  const cookieStore =
    await cookies();


  const token =
    cookieStore.get(
      "safetalk_token"
    )?.value;


  if (!token) {
    return null;
  }


  return await verifyToken(token);
}