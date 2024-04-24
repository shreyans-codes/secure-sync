package com.internevaluation.formfiller.Service;

import com.internevaluation.formfiller.Model.CaptchaResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class CaptchaValidator {
    @Autowired
    private RestTemplate rt;
    public  Boolean isValid(String captcha){
        String url="https://www.google.com/recaptcha/api/siteverify";
        String params="?secret=6Lct5ScpAAAAAH86H4e5ug1O2m6iTO9SIB6HXMyN&response="+captcha;

        CaptchaResponse cr=rt.postForObject(url+params,null, CaptchaResponse.class);
        return cr.isSuccess();
    }
}