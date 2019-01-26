from _deployment.inference import inference
import sys

def main():
    ask = sys.argv[1]
    
    resp = inference(str(ask))
    print(resp)
    print(resp['answers'][resp['best_index']])

    sys.stdout.flush()


if __name__ == "__main__":
    main()
