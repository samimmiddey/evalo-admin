export const formatNumber = (num: number) =>
   new Intl.NumberFormat("en-IN").format(num);