<?php

class jointRouter {
    
    var $_routes = Array();
    
    public function __construct($config) {
        
        $this->setup($config);
        
    }
    
    protected function setup($config) {
        
        foreach($config as $cfg) {
            list($method,$path,$fn,$paramsSequence) = $cfg;
            $this->defineRoute($method,$path,$fn,$paramsSequence);
        }
        
    } 
    
    /* add route to config */
    
    protected function defineRoute($method,$path,$fn,$paramsSequence) {
        
        $route = Array('method'=>$method,'path'=>$path,'fn'=>$fn,'paramsSequence'=>$paramsSequence);
        $this->_routes[] = $route;
        return true;
        
    }
    
    /* convert route path definition to regular expression
     * returns regular exporession and variable names to be exprected
     */
    
    protected function convertRoutePathToRegex($path) {
        
        $regexPath = false;       
                
        $last = substr($path,-1);
        $regex = '/\/:([a-zA-Z_]*)/';
        $fn = function($matches) {
          return '/?([0-9a-zA-Z_]*)';
        };
        $regexPath = preg_replace_callback($regex,$fn,$path);
        $variables = Array();
        preg_match_all($regex,$path,$variables);               
        $variables = $variables[1];
        $regexPath = '/^'.str_replace('/','\\/',$regexPath).'$/';
        
        return Array(
            'regex'=>$regexPath,
            'variables'=>$variables
        );
        
    }
    
    /* perform regular expression to match route from request
     * assign variables extracted from request path
     */
    
    protected function matchRoute($route) {        
                
        $req = $this->getRequest();
        
        if($req['method'] != $route['method']) { return false; } 
        $regex = $this->convertRoutePathToRegex($route['path']);
        
        $matches = false;
        
        preg_match_all($regex['regex'],$req['path'],$matches);
        //var_dump($matches);
        
        if(count($matches[0]) > 0) {
            foreach($regex['variables'] as $i=>$v) {
                $route['params'][$v] = $matches[($i+1)][0];
            }
            return $route;
        }
        
        return false;
        
    }
    
    protected function matchAllRoutes() {
        
        $req = $this->getRequest();        
        
        foreach($this->_routes as $route) {            
            $matched = $this->matchRoute($route);
            if($matched) { return $matched; }
        }
        
    }    
    
    protected function getRequestMethod() {
        
        $headers = getallheaders();
        $method = $headers['X-Http-Method-Override'];
        if(!$method) { $method = $_SERVER['REQUEST_METHOD']; }
        
        return $method;
        
    }
    
    protected function getRequestPath() {
        
        return $_SERVER['PATH_INFO'];
        
    }
    
    protected function getRequestData() {
        
        return $_REQUEST;
        
    }
    
    protected function getRequest() {
        
        if(!$this->_request) {
        
            $req = Array(
                'method'=>$this->getRequestMethod(),
                'path'=>$this->getRequestPath(),
                'data'=>$this->getRequestData()
            );
            
            $this->_request = $req;
            
        }
        
        return $this->_request;
        
        
    }
    
    protected function getParamsInOrder($route) {
        
        if(!$route['paramsSequence']) {
            return $route['params'];
        }
        
        $request = $this->getRequest();
        $paramsInOrder = Array();                
        
        foreach($route['paramsSequence'] as $p) {
            
            $dataParam = $request['data'][$p];
            $routeParam = $route['params'][$p];
            
            $param = false;
            
            if($routeParam && $dataParam) {
                $param = $routeParam;
            } else {
                if($routeParam) { $param = $routeParam; }
                if($dataParam) { $param = $dataParam; }
            }
            
            $paramsInOrder[$p] = $param;
            
        }
        
        return $paramsInOrder;
        
    }
    
    public function processRequest(&$model) {
        
        $route = $this->matchAllRoutes();
        
        if(!$route) {
            die('No route matched');
        }
        
        $method = $route['fn'];
        if(method_exists($model,$method)) {            
            $params = $this->getParamsInOrder($route);
            if(!$params) { $params = Array(); }         
            $result = call_user_func_array(Array($model,$method),$params);            
        } else {
            die("Method {$method} not implemented");
        }
        
        echo json_encode($result);
        
    }
    
}