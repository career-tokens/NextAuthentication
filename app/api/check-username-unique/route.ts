import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

//we are going to define a zod schema where an object with username as property
//should match the schema we defined earlier
const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

//lets discuss some things before hand. The API will be:
//(BASE_URL)/api/check-username-unique but the actual link request is made will
//also have query parameter and hence it will be of format:
//(BASE_URL)/api/check-username-unique?username=.....
//since the username is included in the query parameter hence the request type
//can simply be GET
export async function GET(request: Request) {
  //connect to database
  await dbConnect();

  try {
    //extract the entire URL
    const { searchParams } = new URL(request.url);
    //extract the username value from query parameter and store it in object
    const queryParams = {
      username: searchParams.get("username"),
    };

    //try to pass the Zod validation
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      //does not pass the zod validation hence simply pass the errors
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 },
      );
    }

    //zod validation passed
    const { username } = result.data;

    //check for existing user with the same username and is also verified
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      //if verified user with same username exists then return false
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 200 },
      );
    }

    //no verified user with same username present then we can say its unique
    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username:", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 },
    );
  }
}
