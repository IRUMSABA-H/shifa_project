import { createApi , BaseQueryFn} from "@reduxjs/toolkit/query/react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type User = {
    id: string;
    email: string;
    password: string;
};

type LoginCredentials = {
    identifier: string;
    password: string;
};

type LoginResponse = {
    user: User;
    token: string;
};

type SignupCredentials = {
    email: string;
    password: string;
};

type Patient = {
    key: string;
    userId?: string;
    mrno: string;
    patientName: string;
    relation: string;
    patientType: string;
    transplant: string;
    surgeryLocation: string;
    surgeryDate: string;
    arrivalDate: string;
    arrivalLocation: string;
};

const axiosBaseQuery=({baseUrl}:{baseUrl:string}):
BaseQueryFn<{
    url:string;
    method:AxiosRequestConfig["method"];
    data?:AxiosRequestConfig["data"];
    params?:AxiosRequestConfig["params"];
}

>=>
    async ({url, method, data, params})=>{
        try{
            const result=await axios({url:baseUrl+url,method,data,params})
            return { data: result.data };
        }
        catch(axiosError){
            const err=axiosError as AxiosError;
            return{
                error:{
                    status:err.response?.status,
                    data:err.response?.data||err.message,
                }
            }
        }
    }


export const ShifaApi=createApi({
    reducerPath:"ShifaApi",
    baseQuery:axiosBaseQuery({baseUrl:"http://localhost:5000"}),
    
    tagTypes:["Patient"],

    endpoints:(builder)=>({

        getPatients:builder.query<Patient[], void>({
            query:()=>
                ({url:"/Patient",method:"GET"}),
            providesTags:['Patient'],
        }),
        addPatient:builder.mutation<Patient, Patient>({
            query:(newpatient)=>({
                url:"/Patient",
                method:"POST",
                data:newpatient,  //axios main body ki jagah hum data likhty hain
            }),
            invalidatesTags:['Patient'],
        }),
     deletePatient:builder.mutation({
        query:(id)=>({
            url:`/Patient/${id}`,
            method:"DELETE",
        }),
        invalidatesTags:['Patient'],

     }),
        loginUser:builder.mutation<LoginResponse, LoginCredentials>({
            async queryFn(credentials, _, __, fetchWithBQ) {
                const trimmedIdentifier = credentials.identifier.trim();
                const result = await fetchWithBQ({//call the custom basequery function
                    url: "/users",
                    method: "GET",
                });

                if (result.error) {
                    return { error: result.error as FetchBaseQueryError };
                }

                const users = (result.data ?? []) as User[];
                const user = users.find((u) =>
                    (u.email === trimmedIdentifier || u.id === trimmedIdentifier) &&
                    u.password === credentials.password
                );

                if (!user) {
                    return {
                        error: {
                            status: 401,
                            data: { message: "invalid email or password" },
                        } as FetchBaseQueryError,
                    };
                }

                return { data: { user, token: "fake-jwt-token-123" } };
            },
        }),
        signupUser:builder.mutation<User, SignupCredentials>({
            async queryFn(credentials, _, __, fetchWithBQ) {
                const trimmedEmail = credentials.email.trim().toLowerCase();

                const existingUsersResult = await fetchWithBQ({
                    url: "/users",
                    method: "GET",
                    params: { email: trimmedEmail },
                });

                if (existingUsersResult.error) {
                    return { error: existingUsersResult.error as FetchBaseQueryError };
                }

                const existingUsers = (existingUsersResult.data ?? []) as User[];
                if (existingUsers.length > 0) {
                    return {
                        error: {
                            status: 409,
                            data: { message: "User already exists" },
                        } as FetchBaseQueryError,
                    };
                }

                const newUser: User = {
                    id: crypto.randomUUID(),
                    email: trimmedEmail,
                    password: credentials.password,
                };

                const createUserResult = await fetchWithBQ({
                    url: "/users",
                    method: "POST",
                    data: newUser,
                });

                if (createUserResult.error) {
                    return { error: createUserResult.error as FetchBaseQueryError };
                }

                return { data: createUserResult.data as User };
            },
        })


    })

 })
  export const {useGetPatientsQuery,useAddPatientMutation,useLoginUserMutation,useSignupUserMutation,useDeletePatientMutation}=ShifaApi;
