import { Blob } from "buffer";
import { FileReadResult } from "fs/promises";

export type CoachType = {
   id:number;
   fullName :string;
   email:string;
   password:string;

   certificationPath?:string;
   profilePicturePath?: string;

   token:string;
   certification?:File;
   profilePicture?: File;

}
export type  CoachResponseType=
{
    id :number;
    fullName:string
    email:string;
    password:string;
    certificationPath:string;
    profilePicturePath?: string;
    videoPath:string;
    Token:string;
    certification?:string;
    profilePicture?: string;
    video?:string;
   certificationData: {
    fileContents:string
   }
   profilePictureData: {
    fileContents:string
   }
   videoData:{
     fileContents:string
   }
}
export type UserType={
    id: number;
    username:string;
    min:string;
    email:string;
    password:string;
    profilePicturePath:string;
    token:string;
    profilePicture?:File;
}

export type UserResponseType={
  id: number;
  username:string;
  min:string;
  email:string;
  password:string;
  profilePicturePath:string;
  token:string;
  profilePicture?:string;
  profilePictureData: {
    fileContents:string
   }
}
export type ExerciseResponseType={
  id: number;
  description: string;
  min: string;
  imageOrVideo?: string;
  category: string;
  difficulty: string;
  publishDate: string;
  coachId: number;
  videoUrl?: File;
  videoData: {
    contentType:string
    fileContents:string
    //fileName:Blob| MediaSource
   };
   comments:CommentType[];
}
export type CommentType={
   id :number;
   content:string;
  commentDate :Date;
  userId :number;
 exerciseId :number;
}
export type ExerciseType = {
  id: number;
  description: string;
  min: string;
  imageOrVideo?: string;
  category: string;
  difficulty: string;
  publishDate: string;
  coachId: number;
  videoUrl?: File; // אופציונלי, עבור קישור לוידאו
  // אופציונלי, עבור קובץ וידאו
}
export type MiniExerciseType = {
  id: number;
  description: string;
  min: string;
  category: string;
  difficulty: string;
  coachId: number;
}

export type NavConfigType={
  name:string;
  route:string;
  isAthonticate:boolean;
  settings:NavConfigType[];
}
export type AuthUserType = {
  token: string,
  user: UserResponseType
};
  