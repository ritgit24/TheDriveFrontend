// "use server";

// import { createAdminClient, createSessionClient } from "@/lib/appwrite";
// import { appwriteConfig } from "@/lib/appwrite/config";
// import { Query, ID } from "node-appwrite";
// import { parseStringify } from "@/lib/utils";
// import { cookies } from "next/headers";
// import { avatarPlaceholderUrl } from "@/constants";
// import { redirect } from "next/navigation";

// const getUserByEmail = async (email: string) => {
//   const { databases } = await createAdminClient();

//   const result = await databases.listDocuments(
//     appwriteConfig.databaseId,
//     appwriteConfig.usersCollectionId,
//     [Query.equal("email", [email])],
//   );

//   return result.total > 0 ? result.documents[0] : null;
// };

// const handleError = (error: unknown, message: string) => {
//   console.log(error, message);
//   throw error;
// };

// export const sendEmailOTP = async ({ email }: { email: string }) => {
//   const { account } = await createAdminClient();

//   try {
//     const session = await account.createEmailToken(ID.unique(), email);

//     return session.userId;
//   } catch (error) {
//     handleError(error, "Failed to send email OTP");
//   }
// };

// export const createAccount = async ({
//   fullName,
//   email,
// }: {
//   fullName: string;
//   email: string;
// }) => {
//   const existingUser = await getUserByEmail(email);

//   const accountId = await sendEmailOTP({ email });
//   if (!accountId) throw new Error("Failed to send an OTP");

//   if (!existingUser) {
//     const { databases } = await createAdminClient();

//     await databases.createDocument(
//       appwriteConfig.databaseId,
//       appwriteConfig.usersCollectionId,
//       ID.unique(),
//       {
//         fullName,
//         email,
//         avatar: avatarPlaceholderUrl,
//         accountId,
//       },
//     );
//   }

//   return parseStringify({ accountId });
// };

// export const verifySecret = async ({
//   accountId,
//   password,
// }: {
//   accountId: string;
//   password: string;
// }) => {
//   try {
//     const { account } = await createAdminClient();

//     const session = await account.createSession(accountId, password);

//     (await cookies()).set("appwrite-session", session.secret, {
//       path: "/",
//       httpOnly: true,
//       sameSite: "strict",
//       secure: true,
//     });

//     return parseStringify({ sessionId: session.$id });
//   } catch (error) {
//     handleError(error, "Failed to verify OTP");
//   }
// };

// export const getCurrentUser = async () => {
//   try {
//     const { databases, account } = await createSessionClient();

//     const result = await account.get();

//     const user = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.usersCollectionId,
//       [Query.equal("accountId", result.$id)],
//     );

//     if (user.total <= 0) return null;

//     return parseStringify(user.documents[0]);
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const signOutUser = async () => {
//   const { account } = await createSessionClient();

//   try {
//     await account.deleteSession("current");
//     (await cookies()).delete("appwrite-session");
//   } catch (error) {
//     handleError(error, "Failed to sign out user");
//   } finally {
//     redirect("/sign-in");
//   }
// };

// export const signInUser = async ({ email }: { email: string }) => {
//   try {
//     const existingUser = await getUserByEmail(email);

//     // User exists, send OTP
//     if (existingUser) {
//       await sendEmailOTP({ email });
//       return parseStringify({ accountId: existingUser.accountId });
//     }

//     return parseStringify({ accountId: null, error: "User not found" });
//   } catch (error) {
//     handleError(error, "Failed to sign in user");
//   }
// };
// "use server";

// import { createAdminClient, createSessionClient } from "@/lib/appwrite";
// import { appwriteConfig } from "@/lib/appwrite/config";
// import { ID, Query } from "node-appwrite";
// import { parseStringify } from "@/lib/utils";
// import { cookies } from "next/headers";
// import { avatarPlaceholderUrl } from "@/constants";
// import { redirect } from "next/navigation";

// /**
//  * Create a new user account
//  */
// export const createAccount = async ({
//   fullName,
//   email,
//   password,
// }: {
//   fullName: string;
//   email: string;
//   password: string;
// }) => {
//   const { account, databases } = await createAdminClient();

//   // Create user in Appwrite Auth
//   const user = await account.create(ID.unique(), email, password, fullName);

//   // Save extra info in database
//   await databases.createDocument(
//     appwriteConfig.databaseId,
//     appwriteConfig.usersCollectionId,
//     user.$id,
//     {
//       fullName,
//       email,
//       avatar: avatarPlaceholderUrl,
//       accountId: user.$id,
//     }
//   );

//   return parseStringify({ accountId: user.$id });
// };

// /**
//  * Sign in user with email + password
//  */
// export const signInUser = async ({
//   email,
//   password,
// }: {
//   email: string;
//   password: string;
// }) => {
//   const { account } = await createAdminClient();

//   const session = await account.createEmailPasswordSession(email, password);

//   // Save session cookie
//   (await cookies()).set("appwrite-session", session.secret, {
//     path: "/",
//     httpOnly: true,
//     sameSite: "strict",
//     secure: true,
//   });

//   return parseStringify({ sessionId: session.$id });
// };

// /**
//  * Get currently logged in user
//  */
// export const getCurrentUser = async () => {
//   try {
//     const { account, databases } = await createSessionClient();

//     const result = await account.get();

//     const user = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.usersCollectionId,
//       [Query.equal("accountId", result.$id)]
//     );

//     if (user.total <= 0) return null;

//     return parseStringify(user.documents[0]);
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

// /**
//  * Sign out current user
//  */
// export const signOutUser = async () => {
//   const { account } = await createSessionClient();

//   try {
//     await account.deleteSession("current");
//     (await cookies()).delete("appwrite-session");
//   } catch (error) {
//     console.error("Failed to sign out user:", error);
//   } finally {
//     redirect("/sign-in");
//   }
// };

"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "../appwrite"; // make sure you have this helper
import { appwriteConfig } from "@/lib/appwrite/config";

export const signOutUser = async () => {
  console.log("Sign out called (stub)");
  return true;
};


export const getCurrentUser = async () => {
  return {
    $id: "dummy-user-id",
    email: "test@example.com",
    name: "Local Tester",
  };
};
export const createAccount = async ({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) => {
  const { account, databases } = await createAdminClient();

  // 1. Create auth account
  const newUser = await account.create(ID.unique(), email, password, fullName);

  // 2. Add to users collection
  await databases.createDocument(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    ID.unique(),
    {
      email,
      name: fullName,
      accountId: newUser.$id,
    }
  );

  return newUser;
};

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { account } = await createAdminClient();

  return await account.createEmailPasswordSession(email, password);
};

