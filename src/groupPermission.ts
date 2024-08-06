import { validateGroupPermissions } from "./functions";
// const { validatePermission,validateGroupPermissions } = require("maxi-validate-permissions");

const tokenExpired =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHam00MlNiWjBIM2JseUJORDEybHYwWTMyZWhhT3d6NWMzTWVZb1VnS1hvIn0.eyJleHAiOjE3MjAwNDEyNTgsImlhdCI6MTcyMDAzOTQ1OCwianRpIjoiZDBiNWFmODYtMjYwMS00YzczLWJhYmYtOGQ5Y2EzNTJhYWQwIiwiaXNzIjoiaHR0cHM6Ly9zc28ubWF4aWxhYnMubmV0L2F1dGgvcmVhbG1zL3pldXNEZXYiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZWI5ZTIxMGUtNzRlZS00ZDdmLWEyNTgtYWVhY2JkZTRiMzBhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiemV1cyIsInNlc3Npb25fc3RhdGUiOiI5MmY1MjYwMy0xMjVkLTQzNGItYmU4ZS01Y2YwM2JjMzM2NzMiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vemV1cy5tYXhpbGFicy5uZXQiLCJodHRwOi8vbWF4aS1mcm9udC5zMy13ZWJzaXRlLXVzLWVhc3QtMS5hbWF6b25hd3MuY29tIiwiaHR0cDovL2RlbW8tbWF4aXNlbGxlcmFwcC1mcm9udC1sYXlvdXQuczMtd2Vic2l0ZS11cy1lYXN0LTEuYW1hem9uYXdzLmNvbSIsImh0dHBzOi8vbmV3YmFja29mZmljZS5teWxhYnMubXgiLCJodHRwczovL29hdXRoLnBzdG1uLmlvIiwiaHR0cDovL21heGktYmFja29mZmljZS10ZXN0LnMzLXdlYnNpdGUtdXMtZWFzdC0xLmFtYXpvbmF3cy5jb20iLCJodHRwOi8vNTQuODYuMzkuMTA6OTAwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImh0dHA6Ly9zdGcuYWEubWF4aWxhYnMubmV0LnMzLXdlYnNpdGUtdXMtZWFzdC0xLmFtYXpvbmF3cy5jb20iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwczovL2tyYXRvcy1tZmEtZGV2Lm15bGFicy5teCIsImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy16ZXVzZGV2Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InpldXMiOnsicm9sZXMiOlsiWkVVU19NRl9TT0xJQ0lUQV9DT1JQT1JBVElWTyIsIlpFVVNfQU5SWV9TRVJWX1NVUCIsIlpFVVNfTUZfQ09OU1VMVEFfRkQiLCJaRVVTX0hFUk1FUzJfQURNSU4iLCJaRVVTX01GX0FDVFVBTElaQV9GRCIsIlpFVVNfTUZfQ09OU1VMVEFfT0kiLCJaRVVTX01GX0FDVFVBTElaQV9PSSIsIlpFVVNfTUZfU09MSUNJVEFfSU1QUkVOVEEiLCJaRVVTX01GX0FDQ0VTTyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6IjkyZjUyNjAzLTEyNWQtNDM0Yi1iZThlLTVjZjAzYmMzMzY3MyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiSm9zZSBHaWwiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJleHQuYWpnaWxAbWF4aWxsYy5jb20iLCJnaXZlbl9uYW1lIjoiSm9zZSIsImZhbWlseV9uYW1lIjoiR2lsIiwiZW1haWwiOiJleHQuYWpnaWxAbWF4aWxsYy5jb20ifQ.SvPq8J4IN-XS2b7nmNpnuI1i8sz3ClRZcHOsajSsIyDkoCcmGnrpvgYB0qw5Bap46VWSl2jhakSjZyoPCb7SmZtLF4saWjn4Jmj9WDYA7C5TSzsSB37rBx42B7rquua0qqnXN60n9YLVd9kLRsYz4z0pM9bOzPBwlbDitLYMthLgNs6ZdOE-tT6lc-NCwOEnW3P2LEDCh5a7CopnZy8fO57t_20C2PxEaTYAOsrkDneRx6cdmVwqqggv1HUSzehEE7B9bDz2H3aUl5cIvFBN1-YCBQFNsqody_TSV2jpXi-f2mbwmtvBRTmApw70vpAu6Fv1cJ0XlWrKZCQ1aew9sA";

  const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHam00MlNiWjBIM2JseUJORDEybHYwWTMyZWhhT3d6NWMzTWVZb1VnS1hvIn0.eyJleHAiOjE3MjA0OTQ0NTYsImlhdCI6MTcyMDQ5MjY1NiwianRpIjoiNGU5N2YyMzktMzViZS00MzQzLTgxNmYtODRjY2MwNTI3Y2NkIiwiaXNzIjoiaHR0cHM6Ly9zc28ubWF4aWxhYnMubmV0L2F1dGgvcmVhbG1zL3pldXNEZXYiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZWI5ZTIxMGUtNzRlZS00ZDdmLWEyNTgtYWVhY2JkZTRiMzBhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiemV1cyIsInNlc3Npb25fc3RhdGUiOiIzYzQwZDdmZS04OWQyLTQwMTgtYjFjYi02NTFhNDk0MmNjYWIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHBzOi8vemV1cy5tYXhpbGFicy5uZXQiLCJodHRwOi8vbWF4aS1mcm9udC5zMy13ZWJzaXRlLXVzLWVhc3QtMS5hbWF6b25hd3MuY29tIiwiaHR0cDovL2RlbW8tbWF4aXNlbGxlcmFwcC1mcm9udC1sYXlvdXQuczMtd2Vic2l0ZS11cy1lYXN0LTEuYW1hem9uYXdzLmNvbSIsImh0dHBzOi8vbmV3YmFja29mZmljZS5teWxhYnMubXgiLCJodHRwczovL29hdXRoLnBzdG1uLmlvIiwiaHR0cDovL21heGktYmFja29mZmljZS10ZXN0LnMzLXdlYnNpdGUtdXMtZWFzdC0xLmFtYXpvbmF3cy5jb20iLCJodHRwOi8vNTQuODYuMzkuMTA6OTAwMCIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImh0dHA6Ly9zdGcuYWEubWF4aWxhYnMubmV0LnMzLXdlYnNpdGUtdXMtZWFzdC0xLmFtYXpvbmF3cy5jb20iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwczovL2tyYXRvcy1tZmEtZGV2Lm15bGFicy5teCIsImh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy16ZXVzZGV2Iiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InpldXMiOnsicm9sZXMiOlsiWkVVU19NRl9TT0xJQ0lUQV9DT1JQT1JBVElWTyIsIlpFVVNfQU5SWV9TRVJWX1NVUCIsIlpFVVNfTUZfQ09OU1VMVEFfRkQiLCJaRVVTX0hFUk1FUzJfQURNSU4iLCJaRVVTX01GX0FDVFVBTElaQV9GRCIsIlpFVVNfTUZfQ09OU1VMVEFfT0kiLCJaRVVTX01GX0FDVFVBTElaQV9PSSIsIlpFVVNfTUZfU09MSUNJVEFfSU1QUkVOVEEiLCJaRVVTX01GX0FDQ0VTTyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6IjNjNDBkN2ZlLTg5ZDItNDAxOC1iMWNiLTY1MWE0OTQyY2NhYiIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiSm9zZSBHaWwiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJleHQuYWpnaWxAbWF4aWxsYy5jb20iLCJnaXZlbl9uYW1lIjoiSm9zZSIsImZhbWlseV9uYW1lIjoiR2lsIiwiZW1haWwiOiJleHQuYWpnaWxAbWF4aWxsYy5jb20ifQ.nBRITfTknrwHkWBhF2nQ5o1Q3lilzVBtDFCQ7ol6ql0yEjJnJqSKUrZ7Vpl7mKJMnDLEHvaH5BIW0j1WW2PIyeRISj8PnTj1UuYJuDbhJY9enBBMTQCDb3rksxtZJphr_QGRFMRt3wSIhGzSpYI_BoPbVr4Vq51eO_MmRbgF2zz5g0bD1n2xYE-FZObju5h1XhO9TlMoDDMd-mzY9FMrNu9DBE8dZP6weKprPliP-oicoy83aMOZFfUifCrQDLXj8tUCQkuup3giEjOJ7c01c0AGJFfWQwSlt0NiswPFfMLDDLUjJXQisNk-NPwQp0o9bQ2pdbl31Pb0vOjLgKFVYg";

const systemName = "zeus";

const permissions = [
  "TEST_USER_MANAGMENT_PERM_2",
  "TEST_USER_MANAGMENT_PERM_1",
  "TEST_USER_MANAGMENT_PERM_10",
  "TEST_USER_MANAGMENT_PERM_3",
];

validateGroupPermissions(token, systemName, permissions).then((data) =>
  console.log(data)
);
