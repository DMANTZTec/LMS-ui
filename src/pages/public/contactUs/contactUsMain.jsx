
  import React, { useState, useEffect } from 'react';
  import { useForm } from 'react-hook-form'; 
  import { zodResolver } from '@hookform/resolvers/zod';
  import { Send, Loader2, X, CheckCircle2 } from 'lucide-react';
  import { toast } from 'react-hot-toast';
  import { Controller } from 'react-hook-form';
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription, DialogClose } from '@/components/ui/dialog';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
  import Field from '@/components/common/Field';

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

  import { ContactUsSchema } from './contactUsSchema';
  import './contactUs.css';

  // Assuming a generic api mapping file structured like your student-controller config
  import { contactUsApi } from '@/api/contactUsController'; 

  const inputCls = (hasError) =>
    `h-11 w-full rounded-xl border px-4 text-sm transition outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500/20 focus:bg-white
    ${hasError ? "border-red-400 bg-red-50 focus:border-red-400" : "border-gray-100 bg-gray-50/50 focus:border-teal-600"}`;

  const selectCls = (hasError) =>
    `h-11 w-full rounded-xl border px-4 text-sm transition outline-none bg-gray-50/50 focus:ring-2 focus:ring-teal-500/20 focus:bg-white text-gray-700
    ${hasError ? "border-red-400 bg-red-50" : "border-gray-100 focus:border-teal-600"}`;



  const ContactUsMain = ({open, onOpenChange}) => {
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [globalError, setGlobalError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

  


    const {
      register,
      handleSubmit,
      control,
      setError,
      formState: { errors, isDirty },
      watch,
      reset
    } = useForm({
      resolver: zodResolver(ContactUsSchema),
      defaultValues: {
        fullName: "",
        mobileNum: "",
        emailId: "",
        currentPosition: "",
        location: ""
      }
    });

  const [fname, mobileNum, email, currentPosition, location] = watch([
    "fullName",
    "mobileNum",
    "emailId",
    "currentPosition",
    "location"
  ]);

  useEffect(() => {
    //setIsSubmitted(false);
    setGlobalError(null);
  }, [fname, mobileNum, email, currentPosition, location]);
    

    const onSubmit = async (data) => {
      console.log("entered into onSubmit function and form data is ", data);
      setIsSubmitting(true);
      setIsSubmitted(false);
      setGlobalError(null);
      try {
        // Map properties cleanly over to your Spring Boot Controller endpoints
        const response = await contactUsApi.createContactUs({
          fullName: data.fullName,
          mobileNumber: data.mobileNum,
          email: data.emailId,
          currentPosition: data.currentPosition,
          location: data.location
        });
  console.log("response is: ",response);
  //setIsSubmitted(true);
  
  // toast.success("submitted successfully ! Our team will reach out to you shortly. 🎉",{
  //   duration: 5000,
  //   className: '!bg-green-800 !text-white'
  // });
  reset();
  setIsSubmitted(true);
  console.log("isSubmitted value is: ", isSubmitted);
      } catch (error) {
        console.error("Contact request submission failure:", error);
        
          setGlobalError(error.response?.data?.message || "Internal system connection issue. Please try again.");
      
      } finally {
        setIsSubmitting(false);
        
      }
    };

    const onOpenDialogChange = (isOpen) => {
      setIsSubmitted(false);
      setGlobalError(null);
      //console.log("onOpenDialogChange() function is called. and value of isOpen is: ",isOpen);
      onOpenChange(isOpen);
      reset();
    };

    return (
    <>
    
  <Dialog open={open} onOpenChange={onOpenDialogChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto hide-scrollbar 
      [&>button.absolute]:bg-white
      [&>button.absolute]:top-6
      [&>button.absolute]:right-6
      [&>button.absolute_svg]:w-4
      [&>button.absolute_svg]:h-4
      ">
<VisuallyHidden>
<DialogTitle />
</VisuallyHidden>

<VisuallyHidden>
<DialogDescription />
</VisuallyHidden>

{/* ================================================= SUCCESS SCREEN ================================================= */} 
{isSubmitted ? ( 
  <div className="flex min-h-[400px] flex-col items-center justify-center px-6 py-10 text-center"> 
  {/* Green check icon */} 
  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"> 
  <CheckCircle2 className="h-10 w-10 text-green-600" /> 
</div> 
{/* Heading */} 
<h2 className="text-2xl font-bold text-gray-800">
Message Submitted! 
</h2> 
{/* Message */} 
<p className="mt-4 max-w-md text-sm leading-6 text-gray-600">
Your message has been submitted successfully. Our team will get back to you soon. </p> 
{/* Close button */} 
<Button type="button" onClick={() => onOpenDialogChange()} className=" mt-8 w-full rounded-xl bg-[#008080] hover:bg-[#006666] " > 
  Close 
</Button> 
</div>
 ) 
: (

      <div className='flex justify-center'>
        <div className="w-full p-0 border-none rounded-2xl bg-white shadow-2xl  justify-center">
          
          {/* Teal Header Layout Frame */}
          <div className=" pl-{150px} bg-[#008080] text-white p-6 text-center space-y-2 relative">
            
              
            
            
            <div className="text-2xl font-bold tracking-wide text-white text-center">
              Contact Us
            </div>
            <div className="text-sm text-teal-50/80 font-normal max-w-[400px] mx-auto leading-relaxed">
              Fill in your details and our team will get back to you within 24 hours.
            </div>
          </div>

          {/* Global Error Banner Box */}
          {globalError && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
              {globalError}
            </div>
          )}



          {/* Dynamic Form Content Body */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 space-y-4 ">
            
            <Field label="Full Name * " error={errors.fullName?.message} labelClassName="text-sm font-semibold text-gray-700">
              <Input 
                {...register("fullName")} 
                className={inputCls(!!errors.fullName)} 
                placeholder="e.g. Priya Sharma" 
              />
            </Field>

            <Field label="Mobile Number * " error={errors.mobileNum?.message} labelClassName="text-sm font-semibold text-gray-700">
              <Input 
                {...register("mobileNum")} 
                className={inputCls(!!errors.mobileNum)} 
                placeholder="e.g. +91 9876543210" 
              />
            </Field>

            <Field label="E-mail Address * " error={errors.emailId?.message} labelClassName="text-sm font-semibold text-gray-700">
              <Input 
                type="email"
                {...register("emailId")} 
                className={inputCls(!!errors.emailId)} 
                placeholder="e.g. priya@example.com" 
              />
            </Field>

            <Field label="Current Position * " error={errors.currentPosition?.message} labelClassName="text-sm font-semibold text-gray-700">
              
 
    <Controller
        name="currentPosition"
        control={control}
        render={({ field }) => (
            <Select
                value={field.value}
                onValueChange={field.onChange}
            >
                <SelectTrigger
                    className={selectCls(!!errors.currentPosition)}
                >
                    <SelectValue placeholder="Select your position" />
                </SelectTrigger>

                <SelectContent>
                    
                    <SelectItem value="STUDENT">
                      Student
                      </SelectItem>

                    <SelectItem value="DEVELOPER">
                        Developer
                    </SelectItem>

                    <SelectItem value="WORKING_PROFESSIONAL">
                        Working Professional
                    </SelectItem>

                    <SelectItem value="FREELANCER">
                        Freelancer
                    </SelectItem>

                    <SelectItem value="DEVOPS_ENGINEER">
                        DevOps Engineer
                    </SelectItem>

                    <SelectItem value="TEST_ENGINEER">
                        Test Engineer
                    </SelectItem>

                    <SelectItem value="QA_ENGINEER">
                        QA Engineer
                    </SelectItem>

                    <SelectItem value="OTHER">
                        Other
                    </SelectItem>
                </SelectContent>
            </Select>
        )}
    />
            </Field>

            <Field label="Location" error={errors.location?.message} labelClassName="text-sm font-semibold text-gray-700">
              <Input 
                {...register("location")} 
                className={inputCls(!!errors.location)} 
                placeholder="e.g. Mumbai, Maharashtra" 
              />
            </Field>

            {/* Action Footer Submission Button Layout */}
            <div className="pt-2 space-y-3">
              <Button
                type="submit"
                disabled={!isDirty || isSubmitting}
                className="h-12 w-full rounded-xl bg-[#008080] hover:bg-[#006666] text-sm font-semibold text-white shadow-md transition active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 transform rotate-0" />
                    Contact Us
                  </>
                )}
              </Button>
              
              <p className="text-xs text-gray-400 text-center tracking-wide font-normal">
                Your information is kept private and never shared.
              </p>
            </div>
            
          </form>


        </div>
        </div>

)}

  </DialogContent>
        </Dialog>
        
        </>
    );
  };

  export default ContactUsMain;

