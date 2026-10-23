export const getImage = (imageUrl: string | null) => {
   if (imageUrl?.startsWith("http")) return imageUrl;

   return "/user.png";
};