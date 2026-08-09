import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

const generateRandomCode = (length = 4) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { team_name, track, members } = body;

    if (!team_name || !track || !members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { error: "Invalid registration payload. Missing required fields." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if team name already exists
    const existingTeam = await db.collection("registrations").findOne({ team_name: { $regex: new RegExp(`^${team_name}$`, "i") } });
    if (existingTeam) {
      return NextResponse.json(
        { error: "Team name already registered." },
        { status: 409 }
      );
    }

    // Leader is always members[0]
    const leader = members[0];
    const teamId = `TEAM-${generateRandomCode(4)}`;

    // Build the structured members array matching the required schema
    const structuredMembers = members.map((m: any, index: number) => {
      const memId = `ASTRA-MEM-${generateRandomCode(4)}`;
      const netId = `ASTRA-NET-${generateRandomCode(4)}`;
      const netPass = generateRandomCode(6);

      return {
        role: index === 0 ? "leader" : "member",
        member_name: m.name,
        Member_id: memId,
        member_college: m.college,
        registration_no: m.registrationNo,
        attendance_1: false,
        attendance_2: false,
        present: false,
        lunch: false,
        network_id: netId,
        network_password: netPass,
        email_id: m.email,
        password: m.password, // Member account login password
      };
    });

    const registrationDoc = {
      team_name,
      Team_id: teamId,
      track,
      Total_member: structuredMembers.length,
      Team_leader: leader.name,
      Leader_number: leader.phone || "",
      Leader_Regestration_No: leader.registrationNo || "",
      members: structuredMembers,
      registeredAt: new Date(),
    };

    const result = await db.collection("registrations").insertOne(registrationDoc);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          ...registrationDoc,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
