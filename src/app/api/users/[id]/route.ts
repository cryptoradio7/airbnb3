import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "../../../../../lib/prisma";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    // Check if user is updating their own profile
    if (session.user.id !== params.id) {
      return NextResponse.json(
        { error: "Vous ne pouvez modifier que votre propre profil" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedFields = updateUserSchema.safeParse(body);
    if (!validatedFields.success) {
      return NextResponse.json(
        { error: validatedFields.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name } = validatedFields.data;

    // Update user
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: "Profil mis à jour avec succès", 
        user: userWithoutPassword 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}